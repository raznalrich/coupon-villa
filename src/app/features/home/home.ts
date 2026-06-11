import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private productService = inject(ProductService);

  featuredProducts = computed(() => this.productService.products().slice(0, 4));
  isLoading = this.productService.isLoading;

  brandScroll = [
    { name: 'Amazon',   logo: '🛒', color: '#ff9900' },
    { name: 'Flipkart', logo: '📦', color: '#2874f0' },
    { name: 'Apple',    logo: '🍎', color: '#555555' },
    { name: 'Giva',     logo: '💎', color: '#c8a96e' },
    { name: 'Myntra',   logo: '👗', color: '#ff3f6c' },
    { name: 'Swiggy',   logo: '🍕', color: '#fc8019' },
    { name: 'Zomato',   logo: '🍽️', color: '#e23744' },
    { name: 'Nykaa',    logo: '💄', color: '#fc2779' },
    { name: 'Ajio',     logo: '👔', color: '#e63946' },
    { name: 'Samsung',  logo: '📱', color: '#1428a0' },
    { name: 'boAt',     logo: '🎧', color: '#e84350' },
    { name: 'Manyavar', logo: '🎪', color: '#8b4513' },
  ];

  topBrands = [
    { name: 'Amazon',   logo: '🛒', color: '#ff9900', deals: 48 },
    { name: 'Flipkart', logo: '📦', color: '#2874f0', deals: 35 },
    { name: 'Apple',    logo: '🍎', color: '#555555', deals: 12 },
    { name: 'Giva',     logo: '💎', color: '#c8a96e', deals: 18 },
    { name: 'Myntra',   logo: '👗', color: '#ff3f6c', deals: 29 },
    { name: 'Swiggy',   logo: '🍕', color: '#fc8019', deals: 22 },
    { name: 'Zomato',   logo: '🍽️', color: '#e23744', deals: 19 },
    { name: 'Nykaa',    logo: '💄', color: '#fc2779', deals: 31 },
  ];

  steps = [
    { num: '01', icon: '🔍', title: 'Find Your Coupon', desc: 'Browse 500+ verified coupons by brand or category.' },
    { num: '02', icon: '📋', title: 'Copy the Code',    desc: 'Click to instantly copy the promo code to your clipboard.' },
    { num: '03', icon: '💸', title: 'Save at Checkout', desc: 'Paste the code on the brand\'s checkout page and enjoy your discount.' },
  ];

  stats = [
    { value: '500+',  label: 'Brands Listed' },
    { value: '5,000+', label: 'Active Coupons' },
    { value: '2L+',   label: 'Happy Savers' },
    { value: '₹2,500', label: 'Avg. Monthly Savings' },
  ];

  services = [
    { icon: '📱', title: 'Electronics',      desc: 'Amazon, Flipkart, Samsung, Apple, boAt & more gadget deals.' },
    { icon: '👗', title: 'Fashion',           desc: 'Myntra, Ajio, Manyavar, H&M & top clothing brand discounts.' },
    { icon: '🍕', title: 'Food & Dining',     desc: 'Swiggy, Zomato, Domino\'s, McDonald\'s & restaurant deals.' },
    { icon: '💄', title: 'Beauty & Wellness', desc: 'Nykaa, Purplle, Plum, Mamaearth & skincare brand offers.' },
    { icon: '💎', title: 'Jewellery',         desc: 'Giva, Caratlane, Tanishq & fine jewellery discount codes.' },
    { icon: '✈️', title: 'Travel',            desc: 'MakeMyTrip, Goibibo, IRCTC & hotel booking coupon codes.' },
    { icon: '📚', title: 'Education',         desc: 'Udemy, Coursera, Byju\'s & online learning platform deals.' },
    { icon: '🏋️', title: 'Sports & Fitness',  desc: 'Nike, Adidas, Puma, Decathlon & sports gear promo codes.' },
  ];

  reasons = [
    { icon: '✅', title: '100% Verified',       desc: 'Every coupon is tested by our team before going live.' },
    { icon: '⚡', title: 'Updated Daily',        desc: 'Fresh deals added every day — never miss a sale event.' },
    { icon: '🆓', title: 'Always Free',          desc: 'No subscriptions, no sign-up fees. Savings are free for everyone.' },
    { icon: '🔔', title: 'Expiry Alerts',        desc: 'Clearly marked expiry dates so you always use codes in time.' },
  ];
}
