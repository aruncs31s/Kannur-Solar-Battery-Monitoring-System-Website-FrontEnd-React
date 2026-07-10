
export type UserResponse = {
  id: string;
  name: string;
  username: string;
  email?: string;
  role?: string;
};


export type UserLoginResponse = {
  token: string;
  user: UserResponse;
};

export interface UserRecord {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  location_id?: number;
  created_at: string;
}