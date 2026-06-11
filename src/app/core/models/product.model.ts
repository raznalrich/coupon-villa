export interface Product {
    id: string;
    slug: string;
    name: string;
    shortDescription: string;
    description: string;
    price: number;           // minimum order / effective value
    originalPrice?: number;  // original price before discount
    discount?: number;        // discount percentage
    code?: string;            // coupon code to copy
    brand?: string;           // brand name (Amazon, Flipkart, etc.)
    brandColor?: string;     // brand primary hex color
    expiryDate?: string;     // human-readable expiry string
    minOrder?: number;       // minimum order amount
    currency: 'INR';
    images: string[];
    category: string;
    badge?: string;
    isActive: boolean;
}