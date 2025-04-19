import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({ 
    users: defineTable({
        email: v.string(),
        fullname: v.string(),
        username: v.string(),
        phone: v.string(),
        image: v.string(),
        bio: v.optional(v.string()),
        clerkId: v.string(),
    }).index("by_clerk_id", ["clerkId"]),

   
})