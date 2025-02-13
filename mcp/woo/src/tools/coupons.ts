// src/tools/coupons.ts
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { makeWooCommerceRequest } from '../woocommerce.js';
import { WooCommerceCoupon } from '../types/woocommerce-types.js';

const listCouponsSchema = z.object({
    page: z.number().optional().describe("Page number (default: 1)"),
    per_page: z.number().optional().describe("Items per page (default: 10, max: 100)"),
    search: z.string().optional().describe("Search term for coupon code or description"),
    after: z.string().optional().describe("Limit response to coupons published after a given ISO8601 date"),
    before: z.string().optional().describe("Limit response to coupons published before a given ISO8601 date"),
    exclude: z.array(z.number()).optional().describe("Exclude specific coupon IDs from the result"),
    include: z.array(z.number()).optional().describe("Limit result set to specific coupon IDs"),
    offset: z.number().optional().describe("Offset the result set by a specific number of items"),
    order: z.enum(['asc', 'desc']).optional().describe("Order sort attribute ascending or descending"),
    orderby: z.enum(['date', 'id', 'include', 'title', 'slug']).optional().describe("Sort coupons by parameter")
});

const createCouponSchema = z.object({
    code: z.string().describe("Coupon code"),
    discount_type: z.enum(['percent', 'fixed_cart', 'fixed_product']).describe("Determines the type of discount that will be applied"),
    amount: z.string().describe("The amount of discount"),
    description: z.string().optional().describe("Coupon description"),
    date_expires: z.string().optional().describe("The date the coupon expires, in the site's timezone"),
    individual_use: z.boolean().optional().describe("If true, the coupon can only be used individually"),
    product_ids: z.array(z.number()).optional().describe("List of product IDs the coupon can be used on"),
    excluded_product_ids: z.array(z.number()).optional().describe("List of product IDs the coupon cannot be used on"),
    usage_limit: z.number().optional().describe("How many times the coupon can be used in total"),
    usage_limit_per_user: z.number().optional().describe("How many times the coupon can be used per customer"),
    limit_usage_to_x_items: z.number().optional().describe("Max number of items in the cart the coupon can be applied to"),
    free_shipping: z.boolean().optional().describe("If true and if the free shipping method requires a coupon, this coupon will enable free shipping"),
    product_categories: z.array(z.number()).optional().describe("List of category IDs the coupon applies to"),
    excluded_product_categories: z.array(z.number()).optional().describe("List of category IDs the coupon does not apply to"),
    exclude_sale_items: z.boolean().optional().describe("If true, this coupon will not be applied to items that have sale prices"),
    minimum_amount: z.string().optional().describe("Minimum order amount that needs to be in the cart before coupon applies"),
    maximum_amount: z.string().optional().describe("Maximum order amount allowed when using the coupon"),
    email_restrictions: z.array(z.string()).optional().describe("List of email addresses that can use this coupon"),
    meta_data: z.array(z.object({
        key: z.string(),
        value: z.string()
    })).optional().describe("Meta data")
});

const getCouponSchema = z.object({
    id: z.number().describe("The coupon ID")
});

const updateCouponSchema = createCouponSchema.extend({
    id: z.number().describe("Coupon ID")
}).partial();

const deleteCouponSchema = z.object({
    id: z.number().describe("The coupon ID"),
    force: z.boolean().optional().describe("Required to be true, as resource does not support trashing")
});

type ListCouponsParams = z.infer<typeof listCouponsSchema>;
type CreateCouponParams = z.infer<typeof createCouponSchema>;
type GetCouponParams = z.infer<typeof getCouponSchema>;
type UpdateCouponParams = z.infer<typeof updateCouponSchema>;
type DeleteCouponParams = z.infer<typeof deleteCouponSchema>;

export const couponTools: Tool[] = [
    {
        name: "list_coupons",
        description: "Lists all coupons with filtering, sorting, and pagination options",
        inputSchema: zodToJsonSchema(listCouponsSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "create_coupon",
        description: "Creates a new coupon",
        inputSchema: zodToJsonSchema(createCouponSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "get_coupon",
        description: "Gets a coupon by ID",
        inputSchema: zodToJsonSchema(getCouponSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "update_coupon",
        description: "Updates an existing coupon",
        inputSchema: zodToJsonSchema(updateCouponSchema) as { type: "object"; properties: Record<string, unknown> }
    },
    {
        name: "delete_coupon",
        description: "Deletes a coupon",
        inputSchema: zodToJsonSchema(deleteCouponSchema) as { type: "object"; properties: Record<string, unknown> }
    }
];

export const couponHandlers = {
    list_coupons: async (params: ListCouponsParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', "coupons", params);
            const coupons: WooCommerceCoupon[] = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(coupons, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error listing coupons: ${errorMessage}` }],
                },
            };
        }
    },
    create_coupon: async (params: CreateCouponParams) => {
        try {
            const response = await makeWooCommerceRequest('POST', "coupons", params);
            const coupon: WooCommerceCoupon = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(coupon, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error creating coupon: ${errorMessage}` }],
                },
            };
        }
    },
    get_coupon: async (params: GetCouponParams) => {
        try {
            const response = await makeWooCommerceRequest('GET', `coupons/${params.id}`);
            const coupon: WooCommerceCoupon = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(coupon, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error getting coupon: ${errorMessage}` }],
                },
            };
        }
    },
    update_coupon: async (params: UpdateCouponParams) => {
        try {
            const { id, ...updateData } = params;
            const response = await makeWooCommerceRequest('PUT', `coupons/${id}`, updateData);
            const coupon: WooCommerceCoupon = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(coupon, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error updating coupon: ${errorMessage}` }],
                },
            };
        }
    },
    delete_coupon: async (params: DeleteCouponParams) => {
        try {
            const response = await makeWooCommerceRequest('DELETE', `coupons/${params.id}`, { force: params.force });
            const coupon: WooCommerceCoupon = response;
            return {
                toolResult: {
                    content: [{ type: 'text', text: JSON.stringify(coupon, null, 2) }],
                },
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            return {
                toolResult: {
                    isError: true,
                    content: [{ type: 'text', text: `Error deleting coupon: ${errorMessage}` }],
                },
            };
        }
    }
};