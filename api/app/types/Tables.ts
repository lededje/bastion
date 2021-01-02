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
  user_id: User['id'];
  request_token: string;
  access_token: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  revoked_at: string;
}

export interface PhoneNumber {
  id: number;
  user_id: User['id'];
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  sid: string;
  to_phone_number_id: PhoneNumber['id'];
  body: string;
  from_city: string;
  from_zip: string;
  from_country: string;
  from_phone_number: string;
  created_at: string;
  updated_at: string;
}