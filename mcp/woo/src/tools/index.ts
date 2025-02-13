// src/tools/index.ts
import { customerTools, customerHandlers } from './customers.js';
import { orderTools, orderHandlers } from './orders.js';
import { productTools, productHandlers } from './products.js';
import { couponTools, couponHandlers } from './coupons.js';
import { taxRateTools, taxRateHandlers } from './tax_rates.js';
import { shippingTools, shippingHandlers } from './shipping.js';
import { paymentGatewayTools, paymentGatewayHandlers } from './payment_gateways.js';
import { refundTools, refundHandlers } from './refunds.js';
import { productVariationTools, productVariationHandlers } from './product_variations.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

// Aggregate all tools for easy import
export const allTools = [
    ...customerTools,
    ...orderTools,
    ...productTools,
    ...couponTools,
    ...taxRateTools,
    ...shippingTools,
    ...paymentGatewayTools,
    ...refundTools,
    ...productVariationTools
];

// Export the handler mapping with an index signature
export const toolHandlers = {
    ...customerHandlers,
    ...orderHandlers,
    ...productHandlers,
    ...couponHandlers,
    ...taxRateHandlers,
    ...shippingHandlers,
    ...paymentGatewayHandlers,
    ...refundHandlers,
    ...productVariationHandlers
};