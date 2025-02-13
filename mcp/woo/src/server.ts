#!/usr/bin/env node
// src/server.ts
import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env first

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { allTools, toolHandlers } from './tools/index.js';
import { z } from 'zod';

// Create MCP server instance
const server = new McpServer({
    name: "woocommerce",  // Simplified name
    version: "0.0.1"
}, {
    capabilities: {
        tools: allTools.reduce((acc, tool) => {
            acc[tool.name] = tool;
            return acc;
        }, {} as Record<string, any>)
    }
});

// Register each tool from our tools list with its corresponding handler
for (const tool of allTools) {
    const handler = toolHandlers[tool.name as keyof typeof toolHandlers];
    if (!handler) continue;
    
    const wrappedHandler = async (args: any) => {
        // The handler functions are already typed with their specific parameter types
        const result = await handler(args);
        return {
            content: result.toolResult.content.map((item: { type: string; text: string }) => ({
                ...item,
                type: "text" as const
            })),
            isError: result.toolResult.isError
        };
    };
    
    // Create a schema that allows any properties - validation is handled by the tool handlers
    const schema = z.object({}).catchall(z.unknown());
    server.tool(tool.name, schema.shape, wrappedHandler);
}

async function main() {
    // console.log('Starting WooCommerce MCP server...');
    
    if (!process.env.WOOCOMMERCE_API_URL || !process.env.WOOCOMMERCE_CONSUMER_KEY || !process.env.WOOCOMMERCE_CONSUMER_SECRET) {
        // console.error('Missing required environment variables. Please check your .env file.');
        process.exit(1);
    }

    if (process.env.WOOCOMMERCE_API_URL?.startsWith('http:') && process.env.WOOCOMMERCE_INSECURE_HTTP !== 'true') {
        // console.error('Insecure HTTP URL detected. Set WOOCOMMERCE_INSECURE_HTTP=true to allow HTTP connections.');
        process.exit(1);
    }

    try {
        // console.log('Initializing WooCommerce client...');
        const { initWooCommerce } = await import('./woocommerce.js');
        await initWooCommerce();
        // console.log('WooCommerce client initialized successfully.');

        // console.log('Setting up server transport...');
        const transport = new StdioServerTransport();
        await server.connect(transport);
        // console.log('Server transport connected successfully.');
    } catch (error) {
        // console.error('Failed to initialize server:', error);
        process.exit(1);
    }
}

// Handle process signals and errors silently
process.on('SIGTERM', () => {
    // console.log('Received SIGTERM signal, shutting down...');
    process.exit(0);
});
process.on('SIGINT', () => {
    // console.log('Received SIGINT signal, shutting down...');
    process.exit(0);
});
process.on('uncaughtException', (error) => {
    // console.error('Uncaught exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (error) => {
    // console.error('Unhandled rejection:', error);
    process.exit(1);
});

main().catch(() => process.exit(1));