export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  country?: string;
  language?: string;
  created_at?: string;
}

export interface UserProfile extends User {
  saved_deals?: number[];
  saved_products?: number[];
  preferences?: {
    notifications?: boolean;
    newsletter?: boolean;
    preferred_categories?: string[];
  };
}

export interface UserSession {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}