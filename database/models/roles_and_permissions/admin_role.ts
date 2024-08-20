import { admin } from '../admin';
import { admin_role } from './role';
import { relations } from 'drizzle-orm';
import DBModel from '../../../src/libs/database/model_instance';
import { mysqlTable, serial, timestamp, varchar, bigint } from 'drizzle-orm/mysql-core';

export const TABLE_NAME = 'administrator_roles';

export const administrator_role = mysqlTable(TABLE_NAME, {
  id: serial('id').primaryKey(),
  admin_id: varchar('admin_id', { length: 36 }).notNull().references(() => admin.id),
  admin_role_id: bigint('admin_role_id', { mode: 'number', unsigned: true }).notNull().references(() => admin_role.id),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const administratorRoleRelations = relations(administrator_role, ({ one }) => ({
  admin: one(admin, {
    fields: [administrator_role.admin_id],
    references: [admin.id]
  }),
  role: one(admin_role, {
    fields: [administrator_role.admin_role_id],
    references: [admin_role.id]
  })
}));

export const ADMINISTRATOR_ROLE = async () => await new DBModel(TABLE_NAME, administrator_role).getModel();