// types/heroSlider/heroSliderTypes.ts
export interface HeroSlider {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  created_at: string;
  updated_at: string | null;
  order?: number; // Optional for ordering
}

export interface HeroSliderCreate {
  title: string;
  subtitle?: string | null;
  image: string;
}

export interface HeroSliderUpdate {
  title?: string;
  subtitle?: string | null;
  image?: string;
  order?: number;
}