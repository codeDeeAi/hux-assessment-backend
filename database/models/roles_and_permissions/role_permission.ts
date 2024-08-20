import { admin_role } from './role';
import { relations } from 'drizzle-orm';
import { admin_permission } from './permission';
import DBModel from '../../../src/libs/database/model_instance';
import { mysqlTable, serial, int, timestamp, bigint } from 'drizzle-orm/mysql-core';

export const TABLE_NAME = 'admin_role_permissions';

export const admin_role_permission = mysqlTable(TABLE_NAME, {
  id: serial('id').primaryKey(),
  admin_role_id: bigint('admin_role_id', { mode: 'number', unsigned: true }).notNull().references(() => admin_role.id),
  admin_perm_id: bigint('admin_perm_id', { mode: 'number', unsigned: true }).notNull().references(() => admin_permission.id),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const adminRolePermissionRelations = relations(admin_role_permission, ({ one }) => ({
  admin_role: one(admin_role, {
    fields: [admin_role_permission.admin_role_id],
    references: [admin_role.id]
  }),
  permission: one(admin_permission, {
    fields: [admin_role_permission.admin_perm_id],
    references: [admin_permission.id]
  }),
}));

export const ADMIN_ROLE_PERMISSION = async () => await new DBModel(TABLE_NAME, admin_role_permission).getModel();