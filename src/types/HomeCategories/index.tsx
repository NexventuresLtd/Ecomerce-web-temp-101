export interface Category {
  id: number;
  name: string;
  description?: string;
  icon: React.ComponentType<any>;
  bgColor: string;
  textColor: string;
  hoverBg: string;
  link: string;
  badge?: {
    text: string;
    type: 'new' | 'trending' | 'hot';
    color: string;
  };
  stats?: {
    productCount: number;
    discount?: number;
  };
  bgImage?: string;
  overlayImage?: string;
}

export interface CategorySectionProps {
  title?: string;
  subtitle?: string;
  viewMode?: 'grid' | 'carousel';
  showStats?: boolean;
  className?: string;
}