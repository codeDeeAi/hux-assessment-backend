import { media } from '../media';
import { v4 as uuidv4 } from 'uuid';
import { relations } from 'drizzle-orm';
import DBModel from '../../../src/libs/database/model_instance';
import { administrator_role } from '../roles_and_permissions/admin_role';
import { mysqlTable, text, varchar, int, boolean, timestamp } from 'drizzle-orm/mysql-core';

export const TABLE_NAME = 'admins';

export const admin = mysqlTable(TABLE_NAME, {
  id: varchar("id", { length: 36 }).$defaultFn(uuidv4).primaryKey().unique(),
  staff_id: varchar('staff_id', { length: 255 }).notNull().unique(),
  first_name: varchar('first_name', { length: 255 }).notNull(),
  last_name: varchar('last_name', { length: 255 }).notNull(),
  other_names: text('other_names'),
  avatar_id: int('avatar_id').references(() => media.id),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  enabled: boolean('enabled').notNull().default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const adminRelations = relations(admin, ({ one, many }) => ({
  avatar: one(media, {
    fields: [admin.id, admin.avatar_id],
    references: [media.model_uuid, media.id]
  }),
  admin_roles: many(administrator_role, { relationName: 'admin_id' })
}));

export const ADMIN = async () => await new DBModel(TABLE_NAME, admin).getModel();