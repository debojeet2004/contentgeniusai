import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";

export const organization = pgTable("organization", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').unique(),
    logo: text('logo'),
    createdAt: timestamp('created_at').notNull(),
    metadata: text('metadata')
});

export const organizationRelations = relations(organization, ({ many }) => ({
    members: many(member)
}));

export const role = pgEnum("role", ["member", "admin", "owner"]);


export type Role = (typeof role.enumValues)[number];


export const member = pgTable("member", {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    role: role('role').default("member").notNull(),
    createdAt: timestamp('created_at').notNull()
});

export const memberRelations = relations(member, ({ one }) => ({
    organization: one(organization, {
        fields: [member.organizationId],
        references: [organization.id]
    }),
    user: one(user, {
        fields: [member.userId],
        references: [user.id]
    })
}));

// These two invitation table definitions are similar but have some key differences:
// 1. First uses varchar, second uses text for column types
// 2. Second adds foreign key references to organization and user tables
// 3. Second has default "pending" status while first requires status
// 4. First has additional teamId column
// 5. First requires role to be notNull, second makes it optional
// 6. Second adds onDelete cascade behavior

export const invitation = pgTable("invitation", {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: text('role'),
    status: text('status').default("pending").notNull(),
    inviterId: text('inviter_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    
    expiresAt: timestamp('expires_at').notNull(),
});
export const orgsession = pgTable('session', {
  activeOrganizationId: varchar('active_organization_id'),
});

