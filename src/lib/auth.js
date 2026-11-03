import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DATABASE_URL);
const db = client.db("better-auth-a-7");

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["email-password", "google"],
            requireLocalEmailVerified: false,
        },
	},

    emailAndPassword: {
     enabled: true,
     minPasswordLength: 6,
    },
    socialProviders: {
        google: { 
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID, 
            clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET, 
        }, 
    },
    database: mongodbAdapter(db, {
        client,
    }),
});