import { relations } from 'drizzle-orm';
import { admin_role_permission } from './role_permission';
import DBModel from '../../../src/libs/database/model_instance';
import { mysqlTable, serial, text, varchar, timestamp, boolean } from 'drizzle-orm/mysql-core';

export const TABLE_NAME = 'admin_roles';

export const admin_role = mysqlTable(TABLE_NAME, {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  immutable: boolean('immutable').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const adminRoleRelations = relations(admin_role, ({ many }) => ({
  permissions: many(admin_role_permission)
}));

export const ADMIN_ROLE = async () => await new DBModel(TABLE_NAME, admin_role).getModel();