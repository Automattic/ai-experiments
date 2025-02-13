// src/woocommerce.ts
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import * as crypto from 'crypto';

let client: AxiosInstance;

export function initWooCommerce() {
    const baseURL = process.env.WOOCOMMERCE_API_URL || 'your_woocommerce_store_url.com';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || 'your_consumer_key';
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || 'your_consumer_secret';
    const isInsecure = process.env.WOOCOMMERCE_INSECURE_HTTP === 'true';

    client = axios.create({
        baseURL: `${baseURL}/wp-json/wc/v3`,
        httpsAgent: isInsecure ? new https.Agent({ rejectUnauthorized: false }) : undefined,
    });

    // Add request interceptor for WooCommerce authentication
    client.interceptors.request.use((config) => {
        const timestamp = Math.floor(Date.now() / 1000);
        const nonce = crypto.randomBytes(8).toString('hex');

        // Add authentication parameters to URL
        const params = new URLSearchParams(config.params || {});
        params.append('consumer_key', consumerKey);
        params.append('consumer_secret', consumerSecret);
        config.params = params;

        return config;
    });
}

// Initialize WooCommerce when this module loads
initWooCommerce();

// Add a helper to make authenticated requests
export async function makeWooCommerceRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, params?: any) {
    try {
        const response = await client.request({
            method,
            url: endpoint,
            ...(method === 'GET' ? { params } : { data: params }),
        });
        return response.data;
    } catch (error: any) {
        console.error(`WooCommerce API Error (${method} ${endpoint}):`, error.response ? error.response.data : error.message);
        throw new Error(`WooCommerce API Error: ${error.message}`);
    }
}