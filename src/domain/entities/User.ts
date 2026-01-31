export interface User {
  id: string;
  name: string;
  email: string;
  role : 'admin' | 'user';
}

export interface UserCredentials {
  username: string;
  password: string;
}
