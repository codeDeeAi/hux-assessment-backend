// Base path for schema
const schemaPathBaseUrl = './apps/admin/database/models';

// Register all schema here
const registerSchemaPaths = [
    '/admin/index.ts',
    '/roles_and_permissions/admin_role.ts',
    '/roles_and_permissions/permission.ts',
    '/roles_and_permissions/role_permission.ts',
    '/roles_and_permissions/role.ts',
] as Array<string>;

// Export schema paths
export const schemaPaths: Array<string> = registerSchemaPaths.map((path: string) => schemaPathBaseUrl + path);