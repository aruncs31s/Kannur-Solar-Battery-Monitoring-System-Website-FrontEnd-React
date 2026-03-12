export class User {
  id: string;
  username: string;
  name?: string;
  email?: string;
  role?: string;

  constructor(id: string, username: string, name?: string, email?: string, role?: string) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.email = email;
    this.role = role;
  }
  get isAdmin(): boolean {
    return this.role === 'admin';
  }
  fromDTO(dto: CreateUserDTO): User {
    return new User(
      this.id,
      dto.UserCredentials.username,
      dto.name,
      dto.email,
      dto.role
    );
  }
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
