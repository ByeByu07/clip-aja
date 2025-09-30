import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/drizzle/schema";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    emailAndPassword: { enabled: true },
    plugins: [username()]
    // socialProviders: {
    //     github: {
    //         clientId: process.env.GITHUB_CLIENT_ID as string, 
    //         clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    //     }
    // }
})

// export default auth