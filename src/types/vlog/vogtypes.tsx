// types/vlog.ts
export interface Vlog {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  thumbnail: string;
  channel: string;
  published_at: string;
  views: number;
  tags: string[];
  category: string;
}

export interface VlogCreate {
  title: string;
  description: string;
  youtube_id: string;
  thumbnail: string;
  channel: string;
  published_at: string;
  views: number;
  tags: string[];
  category: string;
}