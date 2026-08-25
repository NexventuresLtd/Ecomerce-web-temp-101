// types/authSlider.ts
export interface AuthSlider {
  id: number;
  title: string;
  subtitle: string | null;
  image: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}
