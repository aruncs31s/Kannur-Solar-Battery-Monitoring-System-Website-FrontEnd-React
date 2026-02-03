
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