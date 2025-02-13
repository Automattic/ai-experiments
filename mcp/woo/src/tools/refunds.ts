import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { makeWooCommerceRequest } from '../woocommerce.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { WooCommerceRefund } from '../types/woocommerce-types.js';

const listRefundsSchema = z.object({
    order_id: z.number().describe("Order ID to list refunds for"),
    page: z.number().optional().describe("Page number (default 1)"),
    per_page: z.number().min(1).max(100).optional().describe("Items per page (default 10, max 100)")
});

const createRefundSchema = z.object({
    order_id: z.number().describe("Order ID to create refund for"),
    amount: z.number().optional().describe("Refund amount"),
    reason: z.string().optional().describe("Reason for refund"),
    refunded_by: z.number().optional().describe("User ID of user who created the refund"),
    meta_data: z.array(z.object({
        key: z.string(),
        value: z.string()
    })).optional().describe("Meta data"),
    line_items: z.array(z.object({
        id: z.number().describe("Line item ID"),
        quantity: z.number().optional().describe("Quantity to refund"),
        refund_total: z.number().optional().describe("Total amount to refund for this line item"),
        refund_tax: z.array(z.object({
            id: z.number(),
            amount: z.number()
        })).optional().describe("Tax amounts to refund")
    })).optional().describe("Line items to refund"),
    api_refund: z.boolean().optional().describe("When true, the payment gateway API is used to generate the refund")
});

const getRefundSchema = z.object({
    order_id: z.number().describe("Order ID the refund belongs to"),
    id: z.number().describe("Refund ID")
});

const deleteRefundSchema = z.object({
    order_id: z.number().describe("Order ID the refund belongs to"),
    id: z.number().describe("Refund ID"),
    force: z.boolean().optional().describe("Required to be true, as resource does not support trashing")
});

type ListRefundsParams = z.infer<typeof listRefundsSchema>;
type CreateRefundParams = z.infer<typeof createRefundSchema>;
type GetRefundParams = z.infer<typeof getRefundSchema>;
type DeleteRefundParams = z.infer<typeof deleteRefundSchema>;

export const refundTools: Tool[] = [
    {
        name: "list_refunds",
        description: "Lists all refunds for an order",
        inputSchema: zodToJsonSchema(listRefundsSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "create_refund",
        description: "Creates a new refund for an order",
        inputSchema: zodToJsonSchema(createRefundSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "get_refund",
        description: "Gets a refund by ID",
        inputSchema: zodToJsonSchema(getRefundSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "delete_refund",
        description: "Deletes a refund",
        inputSchema: zodToJsonSchema(deleteRefundSchema) as { type: "object"; properties: Record<string, unknown> }
    }
];

export const refundHandlers = {
    list_refunds: async (params: ListRefundsParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', `orders/${params.order_id}/refunds`, params);
            const refunds: WooCommerceRefund[] = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(refunds, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error listing refunds: ${errorMessage}` }],
                },
            };
        }
    },
    create_refund: async (params: CreateRefundParams) => {
        try {
            const { order_id, ...refundData } = params;
            const response = await makeWooCommerceRequest('POST', `orders/${order_id}/refunds`, refundData);
            const refund: WooCommerceRefund = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(refund, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error creating refund: ${errorMessage}` }],
                },
            };
        }
    },
    get_refund: async (params: GetRefundParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', `orders/${params.order_id}/refunds/${params.id}`);
            const refund: WooCommerceRefund = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(refund, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error getting refund: ${errorMessage}` }],
                },
            };
        }
    },
    delete_refund: async (params: DeleteRefundParams) => {
        try {
            const response = await makeWooCommerceRequest('DELETE', `orders/${params.order_id}/refunds/${params.id}`, { force: params.force });
            const refund: WooCommerceRefund = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(refund, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error deleting refund: ${errorMessage}` }],
                },
            };
        }
    }
}; 