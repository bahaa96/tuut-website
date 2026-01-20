interface OnlineSubscription {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  image_url_en: string;
  image_url_ar: string;
  price: number;
  currency: string;
  duration: number;
  max_users: number;
  features: string[];
}

export type { OnlineSubscription };