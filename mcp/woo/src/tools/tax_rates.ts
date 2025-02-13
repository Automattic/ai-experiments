import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { makeWooCommerceRequest } from '../woocommerce.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { WooCommerceTax } from '../types/woocommerce-types.js';

const listTaxRatesSchema = z.object({
    page: z.number().optional().describe("Page number (default 1)"),
    per_page: z.number().min(1).max(100).optional().describe("Items per page (default 10, max 100)"),
    offset: z.number().optional().describe("Offset the result set by a specific number of items"),
    order: z.enum(['asc', 'desc']).optional().describe("Order sort attribute ascending or descending"),
    orderby: z.enum(['id', 'order', 'priority']).optional().describe("Sort by parameter")
});

const createTaxRateSchema = z.object({
    country: z.string().describe("Country code in ISO 3166-1 alpha-2 format"),
    state: z.string().optional().describe("State code"),
    postcode: z.string().optional().describe("Postcode/ZIP"),
    city: z.string().optional().describe("City name"),
    rate: z.string().describe("Tax rate"),
    name: z.string().describe("Tax rate name"),
    priority: z.number().optional().describe("Tax priority"),
    compound: z.boolean().optional().describe("Whether or not this is a compound rate"),
    shipping: z.boolean().optional().describe("Whether or not this tax rate applies to shipping")
});

const getTaxRateSchema = z.object({
    id: z.number().describe("Tax rate ID")
});

const updateTaxRateSchema = createTaxRateSchema.extend({
    id: z.number().describe("Tax rate ID")
}).partial();

const deleteTaxRateSchema = z.object({
    id: z.number().describe("Tax rate ID"),
    force: z.boolean().optional().describe("Required to be true, as resource does not support trashing")
});

type ListTaxRatesParams = z.infer<typeof listTaxRatesSchema>;
type CreateTaxRateParams = z.infer<typeof createTaxRateSchema>;
type GetTaxRateParams = z.infer<typeof getTaxRateSchema>;
type UpdateTaxRateParams = z.infer<typeof updateTaxRateSchema>;
type DeleteTaxRateParams = z.infer<typeof deleteTaxRateSchema>;

export const taxRateTools: Tool[] = [
    {
        name: "list_tax_rates",
        description: "Lists all tax rates with filtering, sorting, and pagination options",
        inputSchema: zodToJsonSchema(listTaxRatesSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "create_tax_rate",
        description: "Creates a new tax rate",
        inputSchema: zodToJsonSchema(createTaxRateSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "get_tax_rate",
        description: "Gets a tax rate by ID",
        inputSchema: zodToJsonSchema(getTaxRateSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "update_tax_rate",
        description: "Updates an existing tax rate",
        inputSchema: zodToJsonSchema(updateTaxRateSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "delete_tax_rate",
        description: "Deletes a tax rate",
        inputSchema: zodToJsonSchema(deleteTaxRateSchema) as { type: "object"; properties: Record<string, unknown> }
    }
];

export const taxRateHandlers = {
    list_tax_rates: async (params: ListTaxRatesParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', "taxes", params);
            const taxRates: WooCommerceTax[] = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(taxRates, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error listing tax rates: ${errorMessage}` }],
                },
            };
        }
    },
    create_tax_rate: async (params: CreateTaxRateParams) => {
        try {
            const response = await makeWooCommerceRequest('POST', "taxes", params);
            const taxRate: WooCommerceTax = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(taxRate, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error creating tax rate: ${errorMessage}` }],
                },
            };
        }
    },
    get_tax_rate: async (params: GetTaxRateParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', `taxes/${params.id}`);
            const taxRate: WooCommerceTax = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(taxRate, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error getting tax rate: ${errorMessage}` }],
                },
            };
        }
    },
    update_tax_rate: async (params: UpdateTaxRateParams) => {
        try {
            const { id, ...updateData } = params;
            const response = await makeWooCommerceRequest('PUT', `taxes/${id}`, updateData);
            const taxRate: WooCommerceTax = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(taxRate, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error updating tax rate: ${errorMessage}` }],
                },
            };
        }
    },
    delete_tax_rate: async (params: DeleteTaxRateParams) => {
        try {
            const response = await makeWooCommerceRequest('DELETE', `taxes/${params.id}`, { force: params.force });
            const taxRate: WooCommerceTax = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(taxRate, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error deleting tax rate: ${errorMessage}` }],
                },
            };
        }
    }
}; 