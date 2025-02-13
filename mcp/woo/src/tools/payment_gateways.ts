import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { makeWooCommerceRequest } from '../woocommerce.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { WooCommercePaymentGateway } from '../types/woocommerce-types.js';

const listPaymentGatewaysSchema = z.object({});

const getPaymentGatewaySchema = z.object({
    id: z.string().describe("Payment gateway ID")
});

const updatePaymentGatewaySchema = z.object({
    id: z.string().describe("Payment gateway ID"),
    title: z.string().optional().describe("Payment gateway title"),
    description: z.string().optional().describe("Payment gateway description"),
    order: z.number().optional().describe("Payment gateway order"),
    enabled: z.boolean().optional().describe("Whether the gateway is enabled"),
    settings: z.record(z.any()).optional().describe("Payment gateway settings")
});

type ListPaymentGatewaysParams = z.infer<typeof listPaymentGatewaysSchema>;
type GetPaymentGatewayParams = z.infer<typeof getPaymentGatewaySchema>;
type UpdatePaymentGatewayParams = z.infer<typeof updatePaymentGatewaySchema>;

export const paymentGatewayTools: Tool[] = [
    {
        name: "list_payment_gateways",
        description: "Lists all payment gateways",
        inputSchema: zodToJsonSchema(listPaymentGatewaysSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "get_payment_gateway",
        description: "Gets a payment gateway by ID",
        inputSchema: zodToJsonSchema(getPaymentGatewaySchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "update_payment_gateway",
        description: "Updates an existing payment gateway",
        inputSchema: zodToJsonSchema(updatePaymentGatewaySchema) as { type: "object"; properties: Record<string, unknown> }
    }
];

export const paymentGatewayHandlers = {
    list_payment_gateways: async () => {
        try {
            const response = await makeWooCommerceRequest('GET', "payment_gateways");
            const paymentGateways: WooCommercePaymentGateway[] = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(paymentGateways, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error listing payment gateways: ${errorMessage}` }],
                },
            };
        }
    },
    get_payment_gateway: async (params: GetPaymentGatewayParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', `payment_gateways/${params.id}`);
            const paymentGateway: WooCommercePaymentGateway = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(paymentGateway, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error getting payment gateway: ${errorMessage}` }],
                },
            };
        }
    },
    update_payment_gateway: async (params: UpdatePaymentGatewayParams) => {
        try {
            const { id, ...updateData } = params;
            const response = await makeWooCommerceRequest('PUT', `payment_gateways/${id}`, updateData);
            const paymentGateway: WooCommercePaymentGateway = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(paymentGateway, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error updating payment gateway: ${errorMessage}` }],
                },
            };
        }
    }
}; 