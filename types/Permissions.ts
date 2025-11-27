// types/Permissions.ts
export interface UserPermissions {
  canView: string[];
  canEdit: string[];
  canDelete: string[];
  canImport: boolean;
  canExport: boolean;
  canManageUsers: boolean;
  canConfigureSystem: boolean;
}

export const ROLE_PERMISSIONS = {
  admin: {
    canView: ['*'],
    canEdit: ['*'],
    canDelete: ['*'],
    canImport: true,
    canExport: true,
    canManageUsers: true,
    canConfigureSystem: true
  },
  manager: {
    canView: ['dashboard', 'operational', 'reports'],
    canEdit: ['operational'],
    canDelete: [],
    canImport: true,
    canExport: true,
    canManageUsers: false,
    canConfigureSystem: false
  },
  user: {
    canView: ['operational'],
    canEdit: [],
    canDelete: [],
    canImport: false,
    canExport: false,
    canManageUsers: false,
    canConfigureSystem: false
  }
};