export interface User {
  id: string;
  username: string;
  name?: string;
  email?: string;
  role ?: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface CreateUserDTO {
  UserCredentials: UserCredentials;
  name?: string;
  email?: string;
  role?: string;
}