// src/types/woocommerce-types.ts

/**
 * This file defines TypeScript interfaces for WooCommerce resources.
 * These types are used throughout the application to ensure consistency
 * and provide compile-time checking of API responses.
 */

/* ======================
   WooCommerce Coupon
   ====================== */
   export interface WooCommerceCoupon {
    id: number;
    code: string;
    amount: string;
    discount_type: string;
    description: string;
    date_expires?: string;
    individual_use?: boolean;
    product_ids?: number[];
    excluded_product_ids?: number[];
    usage_limit?: number;
    usage_limit_per_user?: number;
    limit_usage_to_x_items?: number;
    free_shipping?: boolean;
    product_categories?: number[];
    excluded_product_categories?: number[];
    exclude_sale_items?: boolean;
    minimum_amount?: string;
    maximum_amount?: string;
    email_restrictions?: string[];
    meta_data?: WooCommerceMetaData[];
  }
  
  /* ======================
     WooCommerce Customer
     ====================== */
  export interface WooCommerceCustomer {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username?: string;
    billing?: WooCommerceAddress;
    shipping?: WooCommerceAddress;
    meta_data?: WooCommerceMetaData[];
    date_created?: string;
    date_modified?: string;
  }
  
  /* ======================
     WooCommerce Order
     ====================== */
  export interface WooCommerceOrder {
    id: number;
    order_number: string; // Sometimes exposed as a string
    status: string;
    currency: string;
    total: string;
    subtotal: string;
    total_tax: string;
    shipping_total: string;
    payment_method: string;
    payment_method_title: string;
    transaction_id?: string;
    customer_id?: number;
    billing: WooCommerceAddress;
    shipping: WooCommerceAddress;
    line_items: WooCommerceOrderLineItem[];
    shipping_lines: WooCommerceShippingLine[];
    fee_lines?: WooCommerceFeeLine[];
    coupon_lines?: WooCommerceCouponLine[];
    refunds?: WooCommerceRefund[];
    meta_data?: WooCommerceMetaData[];
    date_created: string;
    date_modified: string;
  }
  
  /* ======================
     WooCommerce Product
     ====================== */
  export interface WooCommerceProduct {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    date_created: string;
    date_modified: string;
    type: string;
    status: string;
    featured: boolean;
    catalog_visibility: string;
    description: string;
    short_description: string;
    sku: string;
    price: string;
    regular_price: string;
    sale_price: string;
    date_on_sale_from?: string;
    date_on_sale_to?: string;
    price_html: string;
    related_ids: number[];
    meta_data: WooCommerceMetaData[];
    stock_quantity: number | null;
    stock_status: string;
    weight: string;
    dimensions: WooCommerceDimensions;
    shipping_required: boolean;
    shipping_taxable: boolean;
    shipping_class: string;
    reviews_allowed: boolean;
    average_rating: string;
    rating_count: number;
    upsell_ids: number[];
    cross_sell_ids: number[];
    parent_id: number;
    purchase_note: string;
    categories: WooCommerceProductCategory[];
    tags: WooCommerceProductTag[];
    images: WooCommerceProductImage[];
    attributes: WooCommerceProductAttribute[];
    default_attributes: WooCommerceProductDefaultAttribute[];
    variations: number[];
    grouped_products: number[];
    menu_order: number;
  }
  
  /* ======================
     WooCommerce Product Variation
     ====================== */
  export interface WooCommerceProductVariation {
    id: number;
    date_created: string;
    date_modified: string;
    description: string;
    permalink: string;
    sku: string;
    price: string;
    regular_price: string;
    sale_price: string;
    date_on_sale_from?: string;
    date_on_sale_to?: string;
    on_sale: boolean;
    status: string;
    purchasable: boolean;
    virtual: boolean;
    downloadable: boolean;
    downloads: Array<{
      id: string;
      name: string;
      file: string;
    }>;
    download_limit: number;
    download_expiry: number;
    tax_status: string;
    tax_class: string;
    manage_stock: boolean;
    stock_quantity: number | null;
    stock_status: string;
    backorders: string;
    backorders_allowed: boolean;
    backordered: boolean;
    weight: string;
    dimensions: WooCommerceDimensions;
    shipping_class: string;
    shipping_class_id: number;
    image: WooCommerceProductImage;
    attributes: WooCommerceProductDefaultAttribute[];
    menu_order: number;
    meta_data: WooCommerceMetaData[];
  }
  
  /* ======================
     Supporting Interfaces
     ====================== */
  
  /** Common metadata field for most resources */
  export interface WooCommerceMetaData {
    id?: number;
    key: string;
    value: any;
  }
  
  /** Address format used for billing and shipping */
  export interface WooCommerceAddress {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    email?: string;
    phone?: string;
  }
  
  /** Order line item */
  export interface WooCommerceOrderLineItem {
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    taxes: WooCommerceTax[];
    meta_data: WooCommerceMetaData[];
  }
  
  /** Shipping line for an order */
  export interface WooCommerceShippingLine {
    id: number;
    method_title: string;
    method_id: string;
    total: string;
    total_tax: string;
    taxes: WooCommerceTax[];
  }
  
  /** Fee line on an order (if applicable) */
  export interface WooCommerceFeeLine {
    id: number;
    name: string;
    tax_class: string;
    tax_status: string;
    amount: string;
    total: string;
    total_tax: string;
    taxes: WooCommerceTax[];
    meta_data: WooCommerceMetaData[];
  }
  
  /** Coupon line applied to an order */
  export interface WooCommerceCouponLine {
    id: number;
    code: string;
    discount: string;
    discount_tax: string;
  }
  
  /** A refund issued for an order */
  export interface WooCommerceRefund {
    id: number;
    reason: string;
    total: string;
    meta_data: WooCommerceMetaData[];
  }
  
  /** Tax details for order items, fees, or shipping */
  export interface WooCommerceTax {
    id: number;
    total: string;
    subtotal: string;
  }
  
  /** Product dimensions */
  export interface WooCommerceDimensions {
    length: string;
    width: string;
    height: string;
  }
  
  /** Product category */
  export interface WooCommerceProductCategory {
    id: number;
    name: string;
    slug: string;
  }
  
  /** Product tag */
  export interface WooCommerceProductTag {
    id: number;
    name: string;
    slug: string;
  }
  
  /** Product image */
  export interface WooCommerceProductImage {
    id: number;
    src: string;
    name: string;
    alt: string;
  }
  
  /** Product attribute (e.g. color, size) */
  export interface WooCommerceProductAttribute {
    id: number;
    name: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
  }
  
  /** Default attribute value for a variable product */
  export interface WooCommerceProductDefaultAttribute {
    id: number;
    name: string;
    option: string;
  }
  
  /* ======================
     WooCommerce Payment Gateway
     ====================== */
  export interface WooCommercePaymentGateway {
    id: string;
    title: string;
    description: string;
    order: number;
    enabled: boolean;
    method_title: string;
    method_description: string;
    settings: Record<string, any>;
  }
  