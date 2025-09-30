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
    plugins: [username()],
    socialProviders: {
        tiktok: {
            clientSecret: process.env.TIKTOK_CLIENT_SECRET as string, 
            clientKey: process.env.TIKTOK_CLIENT_KEY as string, 
            redirectURI: "https://2cd45fb9fcc8.ngrok-free.app/api/auth/callback/tiktok",
        },  
    },
    account: {
        accountLinking : {
            enabled: true
        }
    },
    trustedOrigins: ["http://localhost:3000", "https://2cd45fb9fcc8.ngrok-free.app"],
    onError: (error) => {
        console.error(error)
    }
})

// export default auth