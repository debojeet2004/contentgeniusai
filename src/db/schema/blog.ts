import { index, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";
import { organization } from "./organization";

export const Status = pgEnum('status', ['pending', 'draft', 'published']);
export const ContentType = pgEnum('content_type', ['Knowledge/Informative', 'Creative/Storytelling', 'Lifestyle/Experience', 'Opinion/Commentary']);

export const blog = pgTable("blog",{
    id: uuid("id").defaultRandom().primaryKey(),
    brandId: text('brand_id').references(() => organization.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),

    contentType : ContentType('content_type').notNull(),
    status: Status('status'),

    inputmetadata: jsonb('input_metadata').notNull(),
    tags: text("tags").array(), 
    outputdata: jsonb('output_data'),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => {
    return [
        index("tags_idx").on(table.tags),
        index("brand_id_idx").on(table.brandId),
        index("user_id_idx").on(table.userId),
        index("brand_user_idx").on(table.brandId, table.userId),
    ];
});
