// src/tools/products.ts
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { makeWooCommerceRequest } from '../woocommerce.js';
import { WooCommerceProduct } from '../types/woocommerce-types.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const listProductsSchema = z.object({
    page: z.number().optional().describe("Page number (default 1)"),
    per_page: z.number().min(1).max(100).optional().describe("Items per page (default 10, max 100)"),
    search: z.string().optional().describe("Search term for product name or SKU"),
    after: z.string().optional().describe("Limit response to products published after a given ISO8601 date"),
    before: z.string().optional().describe("Limit response to products published before a given ISO8601 date"),
    exclude: z.array(z.number()).optional().describe("Exclude specific product IDs from the result"),
    include: z.array(z.number()).optional().describe("Limit result set to specific product IDs"),
    offset: z.number().optional().describe("Offset the result set by a specific number of items"),
    featured: z.boolean().optional().describe("Limit result set to featured products"),
    category: z.string().optional().describe("Limit result set to products assigned a specific category ID"),
    tag: z.string().optional().describe("Limit result set to products assigned a specific tag ID"),
    status: z.enum(['draft', 'pending', 'private', 'publish']).optional()
        .describe("Limit result set to products assigned a specific status"),
    type: z.enum(['simple', 'grouped', 'external', 'variable']).optional()
        .describe("Limit result set to products assigned a specific type"),
    sku: z.string().optional().describe("Limit result set to products with a specific SKU"),
    orderby: z.enum(['date', 'id', 'include', 'title', 'slug', 'price', 'popularity', 'rating'])
        .optional().describe("Sort products by parameter"),
    order: z.enum(['asc', 'desc']).optional().describe("Order sort attribute ascending or descending"),
    on_sale: z.boolean().optional().describe("Limit result set to products on sale"),
    min_price: z.string().optional().describe("Limit result set to products based on a minimum price"),
    max_price: z.string().optional().describe("Limit result set to products based on a maximum price"),
    stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).optional().describe("Limit result set to products with specified stock status")
});

const createProductSchema = z.object({
    name: z.string().describe("Product name"),
    type: z.enum(['simple', 'grouped', 'external', 'variable']).optional().describe("Product type"),
    status: z.enum(['draft', 'pending', 'private', 'publish']).optional().describe("Product status"),
    featured: z.boolean().optional().describe("Featured product"),
    catalog_visibility: z.enum(['visible', 'catalog', 'search', 'hidden']).optional().describe("Catalog visibility"),
    description: z.string().optional().describe("Product description"),
    short_description: z.string().optional().describe("Product short description"),
    sku: z.string().optional().describe("Unique identifier"),
    regular_price: z.string().optional().describe("Product regular price"),
    sale_price: z.string().optional().describe("Product sale price"),
    date_on_sale_from: z.string().optional().describe("Start date of sale price, in the site's timezone"),
    date_on_sale_to: z.string().optional().describe("End date of sale price, in the site's timezone"),
    virtual: z.boolean().optional().describe("If the product is virtual"),
    downloadable: z.boolean().optional().describe("If the product is downloadable"),
    downloads: z.array(z.object({
        id: z.string().optional(),
        name: z.string(),
        file: z.string()
    })).optional().describe("List of downloadable files"),
    download_limit: z.number().optional().describe("Number of times downloadable files can be downloaded after purchase"),
    download_expiry: z.number().optional().describe("Number of days until download link expires"),
    external_url: z.string().optional().describe("Product external URL. Only for external products"),
    button_text: z.string().optional().describe("Product external button text. Only for external products"),
    tax_status: z.enum(['taxable', 'shipping', 'none']).optional().describe("Tax status"),
    tax_class: z.string().optional().describe("Tax class"),
    manage_stock: z.boolean().optional().describe("Stock management at product level"),
    stock_quantity: z.number().optional().describe("Stock quantity"),
    stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).optional().describe("Controls the stock status of the product"),
    backorders: z.enum(['no', 'notify', 'yes']).optional().describe("If managing stock, this controls if backorders are allowed"),
    sold_individually: z.boolean().optional().describe("Allow one item to be bought in a single order"),
    weight: z.string().optional().describe("Product weight"),
    dimensions: z.object({
        length: z.string(),
        width: z.string(),
        height: z.string()
    }).optional().describe("Product dimensions"),
    shipping_class: z.string().optional().describe("Shipping class slug"),
    reviews_allowed: z.boolean().optional().describe("Allow reviews"),
    upsell_ids: z.array(z.number()).optional().describe("List of up-sell products IDs"),
    cross_sell_ids: z.array(z.number()).optional().describe("List of cross-sell products IDs"),
    parent_id: z.number().optional().describe("Product parent ID"),
    purchase_note: z.string().optional().describe("Optional note to send the customer after purchase"),
    categories: z.array(z.object({
        id: z.number().optional(),
        name: z.string().optional(),
        slug: z.string().optional()
    })).optional().describe("List of categories"),
    tags: z.array(z.object({
        id: z.number().optional(),
        name: z.string().optional(),
        slug: z.string().optional()
    })).optional().describe("List of tags"),
    attributes: z.array(z.object({
        id: z.number().optional(),
        name: z.string(),
        position: z.number().optional(),
        visible: z.boolean().optional(),
        variation: z.boolean().optional(),
        options: z.array(z.string())
    })).optional().describe("List of attributes"),
    default_attributes: z.array(z.object({
        id: z.number().optional(),
        name: z.string(),
        option: z.string()
    })).optional().describe("Defaults variation attributes"),
    grouped_products: z.array(z.number()).optional().describe("List of grouped products ID"),
    menu_order: z.number().optional().describe("Menu order, used to custom sort products"),
    meta_data: z.array(z.object({
        key: z.string(),
        value: z.string()
    })).optional().describe("Meta data")
});

const getProductSchema = z.object({
    id: z.number().describe("Product ID")
});

const updateProductSchema = createProductSchema.extend({
    id: z.number().describe("Product ID")
}).partial();

const deleteProductSchema = z.object({
    id: z.number().describe("Product ID"),
    force: z.boolean().optional().describe("Required to be true, as resource does not support trashing")
});

type ListProductsParams = z.infer<typeof listProductsSchema>;
type CreateProductParams = z.infer<typeof createProductSchema>;
type GetProductParams = z.infer<typeof getProductSchema>;
type UpdateProductParams = z.infer<typeof updateProductSchema>;
type DeleteProductParams = z.infer<typeof deleteProductSchema>;

export const productTools: Tool[] = [
    {
        name: "list_products",
        description: "Lists all products with filtering, sorting, and pagination options",
        inputSchema: zodToJsonSchema(listProductsSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "create_product",
        description: "Creates a new product",
        inputSchema: zodToJsonSchema(createProductSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "get_product",
        description: "Gets a product by ID",
        inputSchema: zodToJsonSchema(getProductSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "update_product",
        description: "Updates an existing product",
        inputSchema: zodToJsonSchema(updateProductSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "delete_product",
        description: "Deletes a product",
        inputSchema: zodToJsonSchema(deleteProductSchema) as { type: "object"; properties: Record<string, unknown> }
    }
];

export const productHandlers = {
    list_products: async (params: ListProductsParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', "products", params);
            const products: WooCommerceProduct[] = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(products, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error listing products: ${errorMessage}` }],
                },
            };
        }
    },
    create_product: async (params: CreateProductParams) => {
        try {
            const response = await makeWooCommerceRequest('POST', "products", params);
            const product: WooCommerceProduct = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(product, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error creating product: ${errorMessage}` }],
                },
            };
        }
    },
    get_product: async (params: GetProductParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', `products/${params.id}`);
            const product: WooCommerceProduct = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(product, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error getting product: ${errorMessage}` }],
                },
            };
        }
    },
    update_product: async (params: UpdateProductParams) => {
        try {
            const { id, ...updateData } = params;
            const response = await makeWooCommerceRequest('PUT', `products/${id}`, updateData);
            const product: WooCommerceProduct = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(product, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error updating product: ${errorMessage}` }],
                },
            };
        }
    },
    delete_product: async (params: DeleteProductParams) => {
        try {
            const response = await makeWooCommerceRequest('DELETE', `products/${params.id}`, { force: params.force });
            const product: WooCommerceProduct = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(product, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error deleting product: ${errorMessage}` }],
                },
            };
        }
    }
};