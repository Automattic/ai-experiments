// src/tools/customers.ts
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { makeWooCommerceRequest } from '../woocommerce.js';
import { WooCommerceCustomer } from '../types/woocommerce-types.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const listCustomersSchema = z.object({
    page: z.number().optional().describe("Page number (default 1)"),
    per_page: z.number().min(1).max(100).optional().describe("Items per page (default 10, max 100)"),
    search: z.string().optional().describe("Search term for customer email or name"),
    exclude: z.array(z.number()).optional().describe("Exclude specific customer IDs from the result"),
    include: z.array(z.number()).optional().describe("Limit result set to specific customer IDs"),
    offset: z.number().optional().describe("Offset the result set by a specific number of items"),
    orderby: z.enum(['id', 'include', 'name', 'email', 'date_created', 'date_modified']).optional()
        .describe("Sort customers by parameter"),
    order: z.enum(['asc', 'desc']).optional().describe("Order sort attribute ascending or descending"),
    role: z.enum(['all', 'administrator', 'customer', 'subscriber']).optional()
        .describe("Filter customers by role"),
    email: z.string().email().optional().describe("Limit result set to customers matching email")
});

const billingSchema = z.object({
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
}).optional();

const shippingSchema = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    company: z.string().optional(),
    address_1: z.string().optional(),
    address_2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().optional()
}).optional();

const metaDataSchema = z.array(z.object({
    key: z.string(),
    value: z.string()
})).optional();

const createCustomerSchema = z.object({
    email: z.string().email().describe("Customer email address"),
    first_name: z.string().optional().describe("Customer first name"),
    last_name: z.string().optional().describe("Customer last name"),
    username: z.string().optional().describe("Customer username"),
    password: z.string().optional().describe("Customer password"),
    billing: billingSchema.describe("Customer billing address"),
    shipping: shippingSchema.describe("Customer shipping address"),
    meta_data: metaDataSchema.describe("Meta data")
}).strict();

const getCustomerSchema = z.object({
    id: z.number().describe("Customer ID")
}).strict();

const updateCustomerSchema = z.object({
    id: z.number().describe("Customer ID"),
    email: z.string().email().optional().describe("Customer email address"),
    first_name: z.string().optional().describe("Customer first name"),
    last_name: z.string().optional().describe("Customer last name"),
    username: z.string().optional().describe("Customer username"),
    password: z.string().optional().describe("Customer password"),
    billing: billingSchema.describe("Customer billing address"),
    shipping: shippingSchema.describe("Customer shipping address"),
    meta_data: metaDataSchema.describe("Meta data")
}).strict();

const deleteCustomerSchema = z.object({
    id: z.number().describe("Customer ID"),
    force: z.boolean().optional().describe("Required to be true, as resource does not support trashing"),
    reassign: z.number().optional().describe("User ID to reassign posts to")
}).strict();

type ListCustomersParams = z.infer<typeof listCustomersSchema>;
type CreateCustomerParams = z.infer<typeof createCustomerSchema>;
type GetCustomerParams = z.infer<typeof getCustomerSchema>;
type UpdateCustomerParams = z.infer<typeof updateCustomerSchema>;
type DeleteCustomerParams = z.infer<typeof deleteCustomerSchema>;

export const customerTools: Tool[] = [
    {
        name: "list_customers",
        description: "Lists all customers with filtering, sorting, and pagination options",
        inputSchema: zodToJsonSchema(listCustomersSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "create_customer",
        description: "Creates a new customer",
        inputSchema: zodToJsonSchema(createCustomerSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "get_customer",
        description: "Gets a customer by ID",
        inputSchema: zodToJsonSchema(getCustomerSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "update_customer",
        description: "Updates an existing customer",
        inputSchema: zodToJsonSchema(updateCustomerSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "delete_customer",
        description: "Deletes a customer",
        inputSchema: zodToJsonSchema(deleteCustomerSchema) as { type: "object"; properties: Record<string, unknown> }
    }
];

export const customerHandlers = {
    list_customers: async (params: ListCustomersParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', "customers", params);
            const customers: WooCommerceCustomer[] = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(customers, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error listing customers: ${errorMessage}` }],
                },
            };
        }
    },
    create_customer: async (params: CreateCustomerParams) => {
        try {
            const response = await makeWooCommerceRequest('POST', "customers", params);
            const customer: WooCommerceCustomer = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(customer, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error creating customer: ${errorMessage}` }],
                },
            };
        }
    },
    get_customer: async (params: GetCustomerParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', `customers/${params.id}`);
            const customer: WooCommerceCustomer = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(customer, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error getting customer: ${errorMessage}` }],
                },
            };
        }
    },
    update_customer: async (params: UpdateCustomerParams) => {
        try {
            const { id, ...updateData } = params;
            const response = await makeWooCommerceRequest('PUT', `customers/${id}`, updateData);
            const customer: WooCommerceCustomer = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(customer, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error updating customer: ${errorMessage}` }],
                },
            };
        }
    },
    delete_customer: async (params: DeleteCustomerParams) => {
        try {
            const response = await makeWooCommerceRequest('DELETE', `customers/${params.id}`, { force: params.force, reassign: params.reassign });
            const customer: WooCommerceCustomer = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(customer, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error deleting customer: ${errorMessage}` }],
                },
            };
        }
    }
};