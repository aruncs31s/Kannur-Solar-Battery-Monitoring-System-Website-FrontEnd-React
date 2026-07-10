import { httpClient } from '../infrastructure/http/HttpClient';
import { UserPermissionView, PermissionsListResponse } from '../application/types/permissions';

export type { UserPermissionView, PermissionsListResponse };



export const permissionsAPI = {
  getPermissions: async (): Promise<PermissionsListResponse> => {
    return await httpClient.get<PermissionsListResponse>('/admin/permissions');
  },

  assignPermissions: async (userId: number, permissions: string[]): Promise<{ message: string }> => {
    return await httpClient.post<{ message: string }>('/admin/permissions/assign', {
      user_id: userId,
      permissions
    });
  },

  transferPermissions: async (fromUserId: number, toUserId: number): Promise<{ message: string }> => {
    return await httpClient.post<{ message: string }>('/admin/permissions/transfer', {
      from_user_id: fromUserId,
      to_user_id: toUserId
    });
  }
};
