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
  expires_at: string;
  revoked_at: string;
}

export interface PhoneNumber {
  id: number;
  user_id: number;
  phone_number: string;
  created_at: string;
  updated_at: string;
}