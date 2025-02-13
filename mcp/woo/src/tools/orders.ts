// src/tools/orders.ts
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { makeWooCommerceRequest } from '../woocommerce.js';
import { WooCommerceOrder } from '../types/woocommerce-types.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const listOrdersSchema = z.object({
    page: z.number().optional().describe("Page number (default 1)"),
    per_page: z.number().min(1).max(100).optional().describe("Items per page (default 10, max 100)"),
    search: z.string().optional().describe("Search term for order ID or customer"),
    after: z.string().optional().describe("Limit response to orders placed after a given ISO8601 date"),
    before: z.string().optional().describe("Limit response to orders placed before a given ISO8601 date"),
    exclude: z.array(z.number()).optional().describe("Exclude specific order IDs from the result"),
    include: z.array(z.number()).optional().describe("Limit result set to specific order IDs"),
    offset: z.number().optional().describe("Offset the result set by a specific number of items"),
    customer: z.number().optional().describe("Limit result set to orders assigned to specific customer IDs"),
    status: z.enum(['any', 'pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed'])
        .optional().describe("Limit result set to orders assigned a specific status"),
    orderby: z.enum(['date', 'id', 'include', 'title', 'slug']).optional()
        .describe("Sort orders by parameter"),
    order: z.enum(['asc', 'desc']).optional().describe("Order sort attribute ascending or descending"),
    customer_is_paying: z.boolean().optional().describe("Filter orders by customers who are paying or have paid"),
    product: z.number().optional().describe("Filter orders by product ID"),
    dp: z.number().optional().describe("Number of decimal points to use in each resource")
});

const createOrderSchema = z.object({
    payment_method: z.string().optional().describe("Payment method ID"),
    payment_method_title: z.string().optional().describe("Payment method title"),
    set_paid: z.boolean().optional().describe("Define if the order is paid. It will set the status to processing and reduce stock items"),
    billing: z.object({
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        company: z.string().optional(),
        address_1: z.string().optional(),
        address_2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postcode: z.string().optional(),
        country: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional()
    }).optional().describe("Billing address"),
    shipping: z.object({
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        company: z.string().optional(),
        address_1: z.string().optional(),
        address_2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postcode: z.string().optional(),
        country: z.string().optional()
    }).optional().describe("Shipping address"),
    line_items: z.array(z.object({
        product_id: z.number().describe("Product ID"),
        quantity: z.number().describe("Quantity"),
        variation_id: z.number().optional().describe("Variation ID, if applicable"),
        meta_data: z.array(z.object({
            key: z.string(),
            value: z.string()
        })).optional().describe("Meta data")
    })).optional().describe("Line items data"),
    shipping_lines: z.array(z.object({
        method_id: z.string().describe("Shipping method ID"),
        method_title: z.string().describe("Shipping method title"),
        total: z.string().describe("Shipping total")
    })).optional().describe("Shipping lines data"),
    coupon_lines: z.array(z.object({
        code: z.string().describe("Coupon code")
    })).optional().describe("Coupon lines data"),
    customer_id: z.number().optional().describe("User ID who owns the order. 0 for guests"),
    customer_note: z.string().optional().describe("Note left by customer during checkout"),
    meta_data: z.array(z.object({
        key: z.string(),
        value: z.string()
    })).optional().describe("Meta data")
});

const getOrderSchema = z.object({
    id: z.number().describe("Order ID")
});

const updateOrderSchema = createOrderSchema.extend({
    id: z.number().describe("Order ID"),
    status: z.enum(['pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed']).optional()
        .describe("Order status")
}).partial();

const deleteOrderSchema = z.object({
    id: z.number().describe("Order ID"),
    force: z.boolean().optional().describe("Required to be true, as resource does not support trashing")
});

type ListOrdersParams = z.infer<typeof listOrdersSchema>;
type CreateOrderParams = z.infer<typeof createOrderSchema>;
type GetOrderParams = z.infer<typeof getOrderSchema>;
type UpdateOrderParams = z.infer<typeof updateOrderSchema>;
type DeleteOrderParams = z.infer<typeof deleteOrderSchema>;

export const orderTools: Tool[] = [
    {
        name: "list_orders",
        description: "Lists all orders with filtering, sorting, and pagination options",
        inputSchema: zodToJsonSchema(listOrdersSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "create_order",
        description: "Creates a new order",
        inputSchema: zodToJsonSchema(createOrderSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "get_order",
        description: "Gets an order by ID",
        inputSchema: zodToJsonSchema(getOrderSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "update_order",
        description: "Updates an existing order",
        inputSchema: zodToJsonSchema(updateOrderSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "delete_order",
        description: "Deletes an order",
        inputSchema: zodToJsonSchema(deleteOrderSchema) as { type: "object"; properties: Record<string, unknown> }
    }
];

export const orderHandlers = {
    list_orders: async (params: ListOrdersParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', "orders", params);
            const orders: WooCommerceOrder[] = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(orders, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error listing orders: ${errorMessage}` }],
                },
            };
        }
    },
    create_order: async (params: CreateOrderParams) => {
        try {
            const response = await makeWooCommerceRequest('POST', "orders", params);
            const order: WooCommerceOrder = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(order, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error creating order: ${errorMessage}` }],
                },
            };
        }
    },
    get_order: async (params: GetOrderParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', `orders/${params.id}`);
            const order: WooCommerceOrder = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(order, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error getting order: ${errorMessage}` }],
                },
            };
        }
    },
    update_order: async (params: UpdateOrderParams) => {
        try {
            const { id, ...updateData } = params;
            const response = await makeWooCommerceRequest('PUT', `orders/${id}`, updateData);
            const order: WooCommerceOrder = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(order, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error updating order: ${errorMessage}` }],
                },
            };
        }
    },
    delete_order: async (params: DeleteOrderParams) => {
        try {
            const response = await makeWooCommerceRequest('DELETE', `orders/${params.id}`, { force: params.force });
            const order: WooCommerceOrder = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(order, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error deleting order: ${errorMessage}` }],
                },
            };
        }
    }
};