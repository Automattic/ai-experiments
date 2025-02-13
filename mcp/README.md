# Model Context Protocol (MCP) Packages

This directory contains Model Context Protocol (MCP) server implementations that enable AI assistants to interact with various Automattic services through natural language.

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for AI language models to interact with external tools and services. It allows AI assistants to perform specific actions and access data through well-defined interfaces, making it possible to extend their capabilities in a structured way.

## Available Packages

### WooCommerce MCP Server (`/woo`)
A full-featured MCP server that enables AI assistants to interact with WooCommerce stores. It provides tools for managing:
- Products and variations
- Orders and refunds
- Customers
- Coupons
- Payment gateways
- Tax rates
- Shipping settings

See the [WooCommerce MCP Server README](./woo/README.md) for detailed documentation.

### WordPress.com MCP Server (`/dotcom`)
*(In Development)*
A planned MCP server for interacting with WordPress.com services and functionality.

## Contributing

Each MCP package in this directory follows these principles:
1. Clear documentation of available tools and their capabilities
2. Secure handling of authentication and sensitive data
3. Comprehensive error handling and input validation
4. Easy setup and configuration process

If you're interested in contributing to existing packages or creating new ones, please refer to the main repository's contributing guidelines. 