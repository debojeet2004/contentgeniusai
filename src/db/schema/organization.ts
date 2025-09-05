import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const industryTypes = pgEnum('industry_type', ['technology', 'healthcare', 'finance', 'education', 'entertainment', 'other']);
export const targetAudienceTypes = pgEnum('target_audience_type', ['business', 'consumer', 'general', 'student']);
export const voiceToneTypes = pgEnum('voice_tone_type', ['formal', 'informal', 'casual', 'consise']);

export const organization = pgTable("organization", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').unique().notNull(),
    logo: text('logo'),

    description: text('description'),
    brandmission: text('brandmission').array(),
    industry: industryTypes('industry').array(),
    targetaudience: targetAudienceTypes('targetaudience').array(),
    voicetone: voiceToneTypes('voicetone').array(),
    uniqsellingpoints: text('uniqsellingpoints').array(),
    competitor: text('competitor').array(),


    metadata: text('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});



export const organizationRole= pgEnum('organization_role', ['owner','admin', 'member']);


export const member = pgTable("member", {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    role: organizationRole('role').notNull().default('member'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const organizationRelations = relations(organization, ({ many }) => ({
    members: many(member)
}));

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



export const invitationStatus = pgEnum('invitation_status', ['pending', 'accepted', 'rejected']);


export const invitation = pgTable("invitation", {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    inviterId: text('inviter_id').notNull().references(() => member.id, { onDelete: 'cascade' }),
    organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    role: organizationRole('role').notNull(),
    status: invitationStatus('status').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
});


export const Orgschema = { organization, member, invitation, organizationRelations, memberRelations };
export const OrgRelations = { organizationRelations, memberRelations };