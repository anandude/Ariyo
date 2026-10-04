export interface Plan {
  id: string;
  description: string;
  date: string;
  time?: string;
}

export interface ImagePosition {
  x: number;
  y: number;
  scale: number;
}

export interface Person {
  id: string;
  user_id: string;
  name: string;
  category: string;
  birthday?: string | null;
  location?: string | null;
  favorite_food?: string | null;
  how_we_met?: string | null;
  image_url?: string | null;
  image_position?: ImagePosition | null;
  custom_fields: Record<string, string>;
  plans_made: Plan[];
  created_at: string;
  updated_at: string;
}
