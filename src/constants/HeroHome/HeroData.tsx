// data/heroData.ts

import type { HeroData } from "../../types/HomeHero";

export const heroData: HeroData = {
//   brandTitle: "NexShop",
//   brandSubtitle: "Discover Tomorrow's Products Today",
  slides: [
    {
      id: 1,
      title: "Revolutionary Tech Collection",
      subtitle: "Smart Devices That Transform Your Lifestyle",
      description: "Experience cutting-edge technology with our curated selection of premium gadgets and smart home solutions.",
      ctaPrimary: "Shop Now",
      ctaSecondary: "Explore Collection",
      imageUrl: "https://umukamezi.com/assets/uploads/slider-1.jpg",
      badge: "New Arrivals",
      stats: {
        rating: 4.9,
        reviews: 2847,
        sales: "10K+"
      }
    },
    {
      id: 2,
      title: "Premium Camera Gear",
      subtitle: "Capture Life's Perfect Moments",
      description: "Professional cameras and accessories for photographers of all skill levels.",
      ctaPrimary: "Shop Cameras",
      ctaSecondary: "View Gallery",
      imageUrl: "https://umukamezi.com/assets/uploads/slider-5.jpg",
      badge: "Limited Edition",
      stats: {
        rating: 4.8,
        reviews: 1923,
        sales: "5K+"
      }
    },
    {
      id: 3,
      title: "Electronics & Gadgets",
      subtitle: "Innovative Tech for Everyday Life",
      description: "Discover the latest electronics that make life easier and more enjoyable.",
      ctaPrimary: "Explore Electronics",
      ctaSecondary: "Tech Specs",
      imageUrl: "https://umukamezi.com/assets/uploads/slider-6.jpg",
      badge: "Best Sellers",
      stats: {
        rating: 4.9,
        reviews: 3456,
        sales: "15K+"
      }
    }
  ]
};