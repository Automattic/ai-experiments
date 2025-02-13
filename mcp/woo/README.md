# WooCommerce MCP Server

This is a Model Context Protocol (MCP) server for WooCommerce, allowing you to interact with your WooCommerce store using natural language via an MCP-compatible client like Claude for Desktop. This server exposes various WooCommerce data and functionality as MCP tools, making it accessible to LLMs.

## Features

This server currently provides basic tools to interact with core WooCommerce data:

*   **Coupons:**
    *   `list_coupons`: List all coupons (supports pagination and searching).
    *   `get_coupon`: Retrieve a specific coupon by ID.
    *   `create_coupon`: Create a new coupon.
    *   `update_coupon`: Update an existing coupon.
    *   `delete_coupon`: Delete a coupon.
*   **Customers:**
    *   `list_customers`: List all customers (supports pagination, filtering and searching).
    *   `get_customer`: Retrieve a specific customer by ID.
    *   `create_customer`: Create a new customer.
    *   `update_customer`: Update an existing customer.
    *   `delete_customer`: Delete a customer.
*   **Orders:**
    *   `list_orders`: List all orders (supports pagination, filtering and searching).
    *   `get_order`: Retrieve a specific order by ID.
    *   `create_order`: Create a new order.
    *   `update_order`: Update an existing order.
    *   `delete_order`: Delete an order.
*   **Products:**
    *   `list_products`: List all products (supports pagination and searching).
    *   `get_product`: Retrieve a specific product by ID.
    *   `create_product`: Create a new product.
    *   `update_product`: Update an existing product.
    *   `delete_product`: Delete a product.
*   **Product Variations:**
    *   `list_product_variations`: List all variations for a product.
    *   `get_product_variation`: Retrieve a specific product variation.
    *   `create_product_variation`: Create a new product variation.
    *   `update_product_variation`: Update an existing product variation.
    *   `delete_product_variation`: Delete a product variation.
*   **Tax Rates:**
    *   `list_tax_rates`: List all tax rates (supports pagination and sorting).
    *   `get_tax_rate`: Retrieve a specific tax rate by ID.
    *   `create_tax_rate`: Create a new tax rate.
    *   `update_tax_rate`: Update an existing tax rate.
    *   `delete_tax_rate`: Delete a tax rate.
*   **Payment Gateways:**
    *   `list_payment_gateways`: List all payment gateways.
    *   `get_payment_gateway`: Retrieve a specific payment gateway.
    *   `update_payment_gateway`: Update an existing payment gateway.
*   **Refunds:**
    *   `list_refunds`: List all refunds for an order.
    *   `get_refund`: Retrieve a specific refund.
    *   `create_refund`: Create a new refund.
    *   `delete_refund`: Delete a refund.

More features and endpoints will be added in future updates.

## Prerequisites

*   **Node.js and npm:** Ensure you have Node.js (version 16 or higher) and npm installed.
*   **WooCommerce Store:** You need an active WooCommerce store with the REST API enabled.
*   **WooCommerce API Keys:**  Generate REST API keys (Consumer Key and Consumer Secret) within your WooCommerce settings (WooCommerce > Settings > Advanced > REST API).  These keys need **Read** access for the resources this server exposes.
* **MCP Client:** You need an application that can communicate with the MCP Server. Currently, Claude Desktop is recommended.

## Installation and Setup

1.  **Clone the Repository (or create a new project):**

    ```bash
    git clone <repository_url>  # Replace with the actual repository URL
    cd woocommerce-mcp-server
    ```

    Or, if creating a new project from scratch:

    ```bash
    mkdir woocommerce-mcp-server
    cd woocommerce-mcp-server
    npm init -y
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```
    or, if you are creating a new project
    ```bash
    npm install @modelcontextprotocol/sdk @woocommerce/woocommerce-rest-api dotenv zod
    npm install -D typescript @types/node ts-node
    ```
    If you cloned, you will need to also install `ts-node` by doing
    ```
    npm install -D ts-node
    ```

3.  **Create a `.env` file:**

    Create a `.env` file in the root of your project directory and add your WooCommerce API credentials:

    ```env
    WOOCOMMERCE_API_URL=https://your-woocommerce-store.com  # Your store's URL, MUST include https://
    WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```

    **Replace the placeholders with your actual values.**  The `WOOCOMMERCE_API_URL` *must* include the `https://` protocol.

4.  **Build the Server (if cloned or using TypeScript):**

    ```bash
    npm run build
    ```
    This compiles the TypeScript code to JavaScript.

5. **Configure Claude Desktop:**

   * Open Claude Desktop settings and navigate to the "Developer" tab.
   * Click "Edit Config" to open the `claude_desktop_config.json` file.
   * Add a new server configuration under the `mcpServers` section. You will need to provide the **absolute** path to the `build/server.js` file and your WooCommerce environment variables:

     ```json
     {
       "mcpServers": {
         "woocommerce": {
           "command": "node",
           "args": ["/absolute/path/to/woocommerce-mcp-server/build/server.js"],
           "env": {
             "WOOCOMMERCE_API_URL": "https://your-woocommerce-store.com",
             "WOOCOMMERCE_CONSUMER_KEY": "ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
             "WOOCOMMERCE_CONSUMER_SECRET": "cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
           }
         }
       }
     }
     ```

     **Important:** 
     * Replace `/absolute/path/to/woocommerce-mcp-server/build/server.js` with the actual *absolute* path to your `server.js` file.
     * Replace the environment variables with your actual WooCommerce API credentials.
     * The `WOOCOMMERCE_API_URL` *must* include the `https://` protocol.

   * Save the `claude_desktop_config.json` file and **restart Claude Desktop**.

Note: While we previously mentioned creating a `.env` file, when using Claude Desktop, the environment variables should be specified directly in the `claude_desktop_config.json` file as shown above. The `.env` file is only needed if you're running the server directly from the command line.

## Running the Server

*If using Claude for Desktop:*

Once you've configured `claude_desktop_config.json` and restarted Claude for Desktop, the server should start automatically whenever Claude for Desktop starts.

*If using the command line directly:*

You can also run the server directly from the command line for testing (this won't connect to Claude for Desktop):

```bash
npm start
```

or if you did not build,
```bash
npm run dev
```

You'll see a message indicating the server is running: "WooCommerce MCP Server running on stdio".  You can then use a tool like the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to interact with it.

## Using the Server with Claude for Desktop

After restarting Claude for Desktop with the server configured, you should see a hammer icon <img src="https://mintlify.s3.us-west-1.amazonaws.com/mcp/images/claude-desktop-mcp-hammer-icon.svg" style={{display: 'inline', margin: 0, height: '1.3em'}} /> in the bottom right corner of the input box. Clicking this icon will show you the available tools provided by the server.

You can now interact with your WooCommerce store through natural language. For example, you can try:

*   "List all my WooCommerce coupons"
*   "Get the customer with ID 123"
*   "Show me all orders from the last month"  (You might need to expand the server's capabilities to handle date filtering.)
*   "List products with 'shirt' in the name"
*   "What's the price of product 42?"

Claude will use the available MCP tools to fulfill your requests.  It will ask for your permission before executing any tool calls.

## Troubleshooting

*   **Server not showing up in Claude Desktop:**
    *   Double-check the `command` and `args` in your `claude_desktop_config.json` file.  The path to `server.js` must be **absolute**, not relative.
    *   Make sure you have restarted Claude Desktop after making changes to the configuration file.
    *   Check the Claude Desktop logs for errors (see the [Debugging Guide](/docs/tools/debugging) for log locations).  Look for errors related to starting the server process.
    *   Try running the server directly from the command line (`npm start`) to see if it starts up without errors.
    *   Ensure Node.js is installed and accessible in your PATH.
    *   Ensure you have run `npm install` to install dependencies.
*   **"Tool not found" error:**
    *   Verify that the tool name you're using matches the `name` defined in the server code.  Tool names are case-sensitive.
*   **WooCommerce API errors:**
    *   Double-check your WooCommerce API URL, consumer key, and consumer secret in the `.env` file.
    *   Ensure the API keys have the necessary read permissions for the resources you're trying to access.
    *   Check the WooCommerce logs for more detailed error messages.
    *   If using HTTPS, ensure your WooCommerce store has a valid SSL certificate.  For *local development only*, you can use `WOOCOMMERCE_INSECURE_HTTP=true` to bypass certificate checks, but **do not use this in production.**
* **"Cannot find package" errors:**
  * Ensure you installed the correct packages. Run `npm install` again to be sure.
* **Permissions errors:**
 * Ensure you are running as a user that has access to the filepaths on the server and the configured WooCommerce instance.
* **Other errors:**
    *   Check the server's console output (if running from the command line) for any error messages.
    *   Use a debugger to step through the server code and identify the issue.
    *   Refer to the [MCP Debugging Guide](/docs/tools/debugging) for more advanced debugging techniques.
    *   Make sure your WooCommerce URL includes the `https://` at the beginning.
    *   Ensure your MCP server does not run on port 80 or 443.

## Extending the Server

This basic server is built for flexibility and can be extended by modifying two key files: server.ts and woocommerce.ts. You can enhance its capabilities in several ways:

*   **Adding More Tools:** Define new tool specifications and implement their handlers. For WooCommerce-specific endpoints, add the necessary integrations in woocommerce.ts, then register the new tools in server.ts.
*   **Implementing More Complex Logic:** Update the tool handlers in server.ts to incorporate advanced processing and data formatting as needed.
*   **Adding Resources:** Extend server.ts by implementing additional endpoints (such as resources/list and resources/read) to expose data directly.
*   **Adding Prompts:** Create or refine prompt templates that guide the LLM in utilizing the full range of updated tools and functionalities.

## Security

*   **Never commit your API keys or secrets to version control.** Use environment variables (the `.env` file) to store them securely.
*   **Limit API key permissions:**  Only grant the necessary permissions (read-only, if possible) to the WooCommerce API keys you use with the MCP server.
*   **Validate Inputs:**  Thoroughly validate all inputs received from the client (especially tool arguments) to prevent injection attacks or unintended behavior.
*   **Consider HTTPS:** Use HTTPS for communication between the client and server, *especially* if you're not using the stdio transport. The quickstart enables `queryStringAuth` and disables certificate checking for local development only.  For production, use proper HTTPS certificates.
*   **Rate Limiting:** Implement rate limiting to prevent abuse of your server and the WooCommerce API.

## Contributing

Contributions are welcome! Please submit a pull request with your changes. Ensure your code follows the existing style and includes tests where appropriate.
