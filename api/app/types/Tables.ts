export interface User {
  id: number;
  name: string;
  email: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccessToken {
  id: number;
  user_id: number;
  request_token: string;
  access_token: string;
  created_at: string;
  updated_at: string;
}