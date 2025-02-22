# LLMS TXT - Plugin to easily generate LLM-friendly text files

A WordPress plugin that provides structured text endpoints for exposing your site's content to LLMs.

## Features

- Provides three dedicated endpoints for accessing site content:
  - `/llms.txt` - A concise listing of all available content (like a table of contents)
  - `/llms-full.txt` - Complete content of all included posts/pages in a Markdown-like format
  - `/llms-small.txt` - Condensed version with excerpts of all included content

- Admin settings page under "Settings > LLMS TXT" to configure:
  - Which post types to include in the endpoints
  - Default includes posts and pages

- Built-in performance optimization:
  - Content is cached using WordPress transients
  - Cache refreshes hourly to ensure content stays current
  - Efficient query handling for large sites

## Installation

1. Upload the `llms-txt` directory to your `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Configure which post types to include via Settings > LLMS TXT

## Usage

After activation, the plugin automatically sets up the following endpoints:

- `https://your-site.com/llms.txt` - Get a listing of all available content
- `https://your-site.com/llms-full.txt` - Get full content in plain text format
- `https://your-site.com/llms-small.txt` - Get excerpts of all content

These endpoints return plain text responses suitable for consumption by LLMs or other text processing tools.

## Configuration

1. Go to Settings > LLMS TXT in your WordPress admin panel
2. Select which post types you want to include in the endpoints
3. Save your settings
4. The endpoints will automatically update to reflect your choices

## Technical Details

- Content is served as plain text with UTF-8 encoding
- URLs and titles are preserved in a Markdown-compatible format
- HTML is stripped from content for clean text output
- Custom post types can be included via the settings page
- Cached content refreshes automatically every hour

## Requirements

- WordPress 5.0 or higher
- PHP 7.0 or higher

## License

GPL-2.0+

## Author

James LePage - Automattic AI