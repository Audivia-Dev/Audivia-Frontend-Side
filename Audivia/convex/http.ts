import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from 'svix';
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
    path: "/audivia",
    method: "POST",
    //check for env variable
    handler: httpAction(async (ctx, req) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if(!webhookSecret) {
            throw new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
        }
        //check for svix headers
        const svix_id = req.headers.get("svix-id")
        const svix_signature = req.headers.get("svix-signature")
        const svix_timestamp = req.headers.get("svix-timestamp")

        if(!svix_id || !svix_signature || !svix_timestamp) {
            throw new Response("Missing svix headers", { status: 400 });
        }

        const payload = await req.json();
        const body = JSON.stringify(payload);
        const wh = new Webhook(webhookSecret);

        let event: any;
        //verify webhook
        try {
            event = wh.verify(body, {
                "svix-id": svix_id,
                "svix-signature": svix_signature,
                "svix-timestamp": svix_timestamp
            }) as any
        } catch (err) {
            console.error(err);
            return new Response("Invalid webhook", { status: 400 });
        }

        const eventType = event.type;
        if(eventType === "user.created") {
            const { id, email_addresses, full_name, image_url, phone_numbers, bio } = event.data;
            const email = email_addresses[0].email_address;
            const fullname = full_name;

            try {
                await ctx.runMutation(api.users.createTask, {
                    clerkId: id,
                    email,
                    fullname,
                    image: image_url,
                    phone: phone_numbers[0].phone_number,
                    bio: bio,
                    username: "",
                })
            } catch (err) {
                console.error(err);
                return new Response("Failed to create user", { status: 500 });
            }
        }

        return new Response("Webhook received", { status: 200 });
    })

});

export default http;