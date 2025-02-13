import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { makeWooCommerceRequest } from '../woocommerce.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { WooCommerceProductVariation } from '../types/woocommerce-types.js';

const listProductVariationsSchema = z.object({
    product_id: z.number().describe("Product ID to list variations for"),
    page: z.number().optional().describe("Page number (default 1)"),
    per_page: z.number().min(1).max(100).optional().describe("Items per page (default 10, max 100)"),
    search: z.string().optional().describe("Search term for variation SKU"),
    after: z.string().optional().describe("Limit response to variations published after a given ISO8601 date"),
    before: z.string().optional().describe("Limit response to variations published before a given ISO8601 date"),
    exclude: z.array(z.number()).optional().describe("Exclude specific variation IDs from the result"),
    include: z.array(z.number()).optional().describe("Limit result set to specific variation IDs"),
    offset: z.number().optional().describe("Offset the result set by a specific number of items"),
    order: z.enum(['asc', 'desc']).optional().describe("Order sort attribute ascending or descending"),
    orderby: z.enum(['date', 'id', 'include', 'title', 'slug']).optional().describe("Sort variations by parameter"),
    parent: z.array(z.number()).optional().describe("Limit result set to variations with specific parent IDs"),
    parent_exclude: z.array(z.number()).optional().describe("Limit result set to all items except variations with specific parent IDs"),
    slug: z.string().optional().describe("Limit result set to variations with a specific slug"),
    status: z.enum(['draft', 'pending', 'private', 'publish']).optional().describe("Limit result set to variations with a specific status"),
    sku: z.string().optional().describe("Limit result set to variations with a specific SKU"),
    tax_class: z.string().optional().describe("Limit result set to variations with a specific tax class"),
    on_sale: z.boolean().optional().describe("Limit result set to variations on sale"),
    min_price: z.string().optional().describe("Limit result set to variations based on a minimum price"),
    max_price: z.string().optional().describe("Limit result set to variations based on a maximum price"),
    stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).optional().describe("Limit result set to variations with specified stock status")
});

const createProductVariationSchema = z.object({
    product_id: z.number().describe("Product ID to create variation for"),
    description: z.string().optional().describe("Variation description"),
    sku: z.string().optional().describe("Unique identifier"),
    regular_price: z.string().optional().describe("Variation regular price"),
    sale_price: z.string().optional().describe("Variation sale price"),
    status: z.enum(['draft', 'pending', 'private', 'publish']).optional().describe("Variation status"),
    virtual: z.boolean().optional().describe("If the variation is virtual"),
    downloadable: z.boolean().optional().describe("If the variation is downloadable"),
    downloads: z.array(z.object({
        id: z.string().optional(),
        name: z.string(),
        file: z.string()
    })).optional().describe("List of downloadable files"),
    download_limit: z.number().optional().describe("Number of times downloadable files can be downloaded after purchase"),
    download_expiry: z.number().optional().describe("Number of days until download link expires"),
    tax_status: z.enum(['taxable', 'shipping', 'none']).optional().describe("Tax status"),
    tax_class: z.string().optional().describe("Tax class"),
    manage_stock: z.boolean().optional().describe("Stock management at variation level"),
    stock_quantity: z.number().optional().describe("Stock quantity"),
    stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).optional().describe("Controls the stock status of the variation"),
    backorders: z.enum(['no', 'notify', 'yes']).optional().describe("If managing stock, this controls if backorders are allowed"),
    weight: z.string().optional().describe("Variation weight"),
    dimensions: z.object({
        length: z.string(),
        width: z.string(),
        height: z.string()
    }).optional().describe("Variation dimensions"),
    shipping_class: z.string().optional().describe("Shipping class slug"),
    image: z.object({
        id: z.number().optional(),
        src: z.string().optional(),
        name: z.string().optional(),
        alt: z.string().optional()
    }).optional().describe("Variation image data"),
    attributes: z.array(z.object({
        id: z.number().optional(),
        name: z.string(),
        option: z.string()
    })).optional().describe("List of attributes"),
    menu_order: z.number().optional().describe("Menu order, used to custom sort variations")
});

const getProductVariationSchema = z.object({
    product_id: z.number().describe("Product ID the variation belongs to"),
    id: z.number().describe("Variation ID")
});

const updateProductVariationSchema = createProductVariationSchema.extend({
    id: z.number().describe("Variation ID")
}).partial();

const deleteProductVariationSchema = z.object({
    product_id: z.number().describe("Product ID the variation belongs to"),
    id: z.number().describe("Variation ID"),
    force: z.boolean().optional().describe("Required to be true, as resource does not support trashing")
});

type ListProductVariationsParams = z.infer<typeof listProductVariationsSchema>;
type CreateProductVariationParams = z.infer<typeof createProductVariationSchema>;
type GetProductVariationParams = z.infer<typeof getProductVariationSchema>;
type UpdateProductVariationParams = z.infer<typeof updateProductVariationSchema>;
type DeleteProductVariationParams = z.infer<typeof deleteProductVariationSchema>;

export const productVariationTools: Tool[] = [
    {
        name: "list_product_variations",
        description: "Lists all variations for a product",
        inputSchema: zodToJsonSchema(listProductVariationsSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "create_product_variation",
        description: "Creates a new variation for a product",
        inputSchema: zodToJsonSchema(createProductVariationSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "get_product_variation",
        description: "Gets a product variation by ID",
        inputSchema: zodToJsonSchema(getProductVariationSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "update_product_variation",
        description: "Updates an existing product variation",
        inputSchema: zodToJsonSchema(updateProductVariationSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "delete_product_variation",
        description: "Deletes a product variation",
        inputSchema: zodToJsonSchema(deleteProductVariationSchema) as { type: "object"; properties: Record<string, unknown> }
    }
];

export const productVariationHandlers = {
    list_product_variations: async (params: ListProductVariationsParams) => {
        try {
            const { product_id, ...queryParams } = params;
            const response = await makeWooCommerceRequest('GET', `products/${product_id}/variations`, queryParams);
            const variations: WooCommerceProductVariation[] = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(variations, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error listing product variations: ${errorMessage}` }],
                },
            };
        }
    },
    create_product_variation: async (params: CreateProductVariationParams) => {
        try {
            const { product_id, ...variationData } = params;
            const response = await makeWooCommerceRequest('POST', `products/${product_id}/variations`, variationData);
            const variation: WooCommerceProductVariation = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(variation, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error creating product variation: ${errorMessage}` }],
                },
            };
        }
    },
    get_product_variation: async (params: GetProductVariationParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', `products/${params.product_id}/variations/${params.id}`);
            const variation: WooCommerceProductVariation = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(variation, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error getting product variation: ${errorMessage}` }],
                },
            };
        }
    },
    update_product_variation: async (params: UpdateProductVariationParams) => {
        try {
            const { product_id, id, ...updateData } = params;
            const response = await makeWooCommerceRequest('PUT', `products/${product_id}/variations/${id}`, updateData);
            const variation: WooCommerceProductVariation = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(variation, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error updating product variation: ${errorMessage}` }],
                },
            };
        }
    },
    delete_product_variation: async (params: DeleteProductVariationParams) => {
        try {
            const response = await makeWooCommerceRequest('DELETE', `products/${params.product_id}/variations/${params.id}`, { force: params.force });
            const variation: WooCommerceProductVariation = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(variation, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error deleting product variation: ${errorMessage}` }],
                },
            };
        }
    }
}; 