import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new task with the given text
export const createTask = mutation(
    {
        args: {
            email: v.string(),
            fullname: v.string(),
            username: v.string(),
            phone: v.string(),
            image: v.string(),
            bio: v.optional(v.string()),
            clerkId: v.string(),
        },
        handler: async (ctx, args) => {

            const existingUser = await ctx.db.query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

            if(existingUser) return
                

            await ctx.db.insert("users", {
                email: args.email,
                fullname: args.fullname,
                username: args.username,
                phone: args.phone,
                image: args.image,
                bio: args.bio,
                clerkId: args.clerkId,
        })
    }
    }
);