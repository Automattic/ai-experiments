import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { makeWooCommerceRequest } from '../woocommerce.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { WooCommerceShippingLine } from '../types/woocommerce-types.js';

const listShippingZonesSchema = z.object({});

const createShippingZoneSchema = z.object({
    name: z.string().describe("Shipping zone name"),
    order: z.number().optional().describe("Shipping zone order")
});

const getShippingZoneSchema = z.object({
    id: z.number().describe("Shipping zone ID")
});

const updateShippingZoneSchema = z.object({
    id: z.number().describe("Shipping zone ID"),
    name: z.string().optional().describe("Shipping zone name"),
    order: z.number().optional().describe("Shipping zone order")
});

const deleteShippingZoneSchema = z.object({
    id: z.number().describe("Shipping zone ID"),
    force: z.boolean().optional().describe("Required to be true, as resource does not support trashing")
});

const listShippingMethodsSchema = z.object({
    zone_id: z.number().describe("Shipping zone ID")
});

const addShippingMethodSchema = z.object({
    zone_id: z.number().describe("Shipping zone ID"),
    method_id: z.string().describe("Shipping method ID (flat_rate, free_shipping, local_pickup, etc)"),
    title: z.string().optional().describe("Shipping method title"),
    order: z.number().optional().describe("Shipping method order"),
    enabled: z.boolean().optional().describe("Whether the shipping method is enabled"),
    settings: z.record(z.any()).optional().describe("Shipping method settings")
});

const updateShippingMethodSchema = z.object({
    zone_id: z.number().describe("Shipping zone ID"),
    instance_id: z.number().describe("Shipping method instance ID"),
    title: z.string().optional().describe("Shipping method title"),
    order: z.number().optional().describe("Shipping method order"),
    enabled: z.boolean().optional().describe("Whether the shipping method is enabled"),
    settings: z.record(z.any()).optional().describe("Shipping method settings")
});

const deleteShippingMethodSchema = z.object({
    zone_id: z.number().describe("Shipping zone ID"),
    instance_id: z.number().describe("Shipping method instance ID"),
    force: z.boolean().optional().describe("Required to be true, as resource does not support trashing")
});

type ListShippingZonesParams = z.infer<typeof listShippingZonesSchema>;
type CreateShippingZoneParams = z.infer<typeof createShippingZoneSchema>;
type GetShippingZoneParams = z.infer<typeof getShippingZoneSchema>;
type UpdateShippingZoneParams = z.infer<typeof updateShippingZoneSchema>;
type DeleteShippingZoneParams = z.infer<typeof deleteShippingZoneSchema>;
type ListShippingMethodsParams = z.infer<typeof listShippingMethodsSchema>;
type AddShippingMethodParams = z.infer<typeof addShippingMethodSchema>;
type UpdateShippingMethodParams = z.infer<typeof updateShippingMethodSchema>;
type DeleteShippingMethodParams = z.infer<typeof deleteShippingMethodSchema>;

export const shippingTools: Tool[] = [
    {
        name: "list_shipping_zones",
        description: "Lists all shipping zones",
        inputSchema: zodToJsonSchema(listShippingZonesSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "create_shipping_zone",
        description: "Creates a new shipping zone",
        inputSchema: zodToJsonSchema(createShippingZoneSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "get_shipping_zone",
        description: "Gets a shipping zone by ID",
        inputSchema: zodToJsonSchema(getShippingZoneSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "update_shipping_zone",
        description: "Updates an existing shipping zone",
        inputSchema: zodToJsonSchema(updateShippingZoneSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "delete_shipping_zone",
        description: "Deletes a shipping zone",
        inputSchema: zodToJsonSchema(deleteShippingZoneSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "list_shipping_methods",
        description: "Lists all shipping methods for a zone",
        inputSchema: zodToJsonSchema(listShippingMethodsSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "add_shipping_method",
        description: "Adds a shipping method to a zone",
        inputSchema: zodToJsonSchema(addShippingMethodSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "update_shipping_method",
        description: "Updates a shipping method in a zone",
        inputSchema: zodToJsonSchema(updateShippingMethodSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "delete_shipping_method",
        description: "Deletes a shipping method from a zone",
        inputSchema: zodToJsonSchema(deleteShippingMethodSchema) as { type: "object"; properties: Record<string, unknown> }
    }
];

export const shippingHandlers = {
    list_shipping_zones: async () => {
        try {
            const response = await makeWooCommerceRequest('GET', "shipping/zones");
            const shippingZones: WooCommerceShippingLine[] = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(shippingZones, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error listing shipping zones: ${errorMessage}` }],
                },
            };
        }
    },
    create_shipping_zone: async (params: CreateShippingZoneParams) => {
        try {
            const response = await makeWooCommerceRequest('POST', "shipping/zones", params);
            const shippingZone: WooCommerceShippingLine = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(shippingZone, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error creating shipping zone: ${errorMessage}` }],
                },
            };
        }
    },
    get_shipping_zone: async (params: GetShippingZoneParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', `shipping/zones/${params.id}`);
            const shippingZone: WooCommerceShippingLine = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(shippingZone, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error getting shipping zone: ${errorMessage}` }],
                },
            };
        }
    },
    update_shipping_zone: async (params: UpdateShippingZoneParams) => {
        try {
            const { id, ...updateData } = params;
            const response = await makeWooCommerceRequest('PUT', `shipping/zones/${id}`, updateData);
            const shippingZone: WooCommerceShippingLine = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(shippingZone, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error updating shipping zone: ${errorMessage}` }],
                },
            };
        }
    },
    delete_shipping_zone: async (params: DeleteShippingZoneParams) => {
        try {
            const response = await makeWooCommerceRequest('DELETE', `shipping/zones/${params.id}`, { force: params.force });
            const shippingZone: WooCommerceShippingLine = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(shippingZone, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error deleting shipping zone: ${errorMessage}` }],
                },
            };
        }
    },
    list_shipping_methods: async (params: ListShippingMethodsParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', `shipping/zones/${params.zone_id}/methods`);
            const shippingMethods: WooCommerceShippingLine[] = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(shippingMethods, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error listing shipping methods: ${errorMessage}` }],
                },
            };
        }
    },
    add_shipping_method: async (params: AddShippingMethodParams) => {
        try {
            const { zone_id, ...methodData } = params;
            const response = await makeWooCommerceRequest('POST', `shipping/zones/${zone_id}/methods`, methodData);
            const shippingMethod: WooCommerceShippingLine = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(shippingMethod, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error adding shipping method: ${errorMessage}` }],
                },
            };
        }
    },
    update_shipping_method: async (params: UpdateShippingMethodParams) => {
        try {
            const { zone_id, instance_id, ...updateData } = params;
            const response = await makeWooCommerceRequest('PUT', `shipping/zones/${zone_id}/methods/${instance_id}`, updateData);
            const shippingMethod: WooCommerceShippingLine = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(shippingMethod, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error updating shipping method: ${errorMessage}` }],
                },
            };
        }
    },
    delete_shipping_method: async (params: DeleteShippingMethodParams) => {
        try {
            const response = await makeWooCommerceRequest('DELETE', `shipping/zones/${params.zone_id}/methods/${params.instance_id}`, { force: params.force });
            const shippingMethod: WooCommerceShippingLine = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(shippingMethod, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error deleting shipping method: ${errorMessage}` }],
                },
            };
        }
    }
}; 