import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/drizzle/schema";
import { username, admin } from "better-auth/plugins";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    emailAndPassword: { enabled: true },
    plugins: [
        username(),
        admin()
    ],
    socialProviders: {
        tiktok: {
            clientSecret: process.env.TIKTOK_CLIENT_SECRET as string, 
            clientKey: process.env.TIKTOK_CLIENT_KEY as string, 
            redirectURI: process.env.NODE_ENV === "development" ? `${process.env.BETTER_AUTH_TIKTOK_URL}/api/auth/callback/tiktok` : `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/tiktok`,
        },
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
            redirectURI: process.env.NODE_ENV === "development" ? `${process.env.BETTER_AUTH_GOOGLE_URL}/api/auth/callback/google` : `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
            prompt: "select_account"
        }, 
    },
    account: {
        accountLinking : {
            enabled: true
        }
    },
    trustedOrigins: ["http://localhost:3000", "https://clipaja.com","https://www.clipaja.com"],
    onError: (error) => {
        console.error(error)
    }
})

// export default auth