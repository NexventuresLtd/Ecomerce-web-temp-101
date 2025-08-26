// types/index.ts
export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  imageUrl: string;
  badge?: string;
  stats?: {
    rating: number;
    reviews: number;
    sales: string;
  };
}

export interface HeroData {
//   brandTitle: string;
//   brandSubtitle: string;
  slides: HeroSlide[];
}