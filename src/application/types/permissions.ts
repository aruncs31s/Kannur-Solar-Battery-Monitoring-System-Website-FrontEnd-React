export interface UserPermissionView {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface PermissionsListResponse {
  users: UserPermissionView[];
  permissions: Record<string, number[]>;
}
