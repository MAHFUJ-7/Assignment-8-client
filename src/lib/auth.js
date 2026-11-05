import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const databaseUrl =
    process.env.BETTER_AUTH_DATABASE_URL || process.env.AUTH_MONGODB_URL;

if (!databaseUrl) {
    throw new Error(
        "Missing MongoDB configuration. Set BETTER_AUTH_DATABASE_URL in the client deployment environment."
    );
}

const client = new MongoClient(databaseUrl);
const db = client.db("assignment-8");

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: (process.env.BETTER_AUTH_TRUSTED_ORIGINS || process.env.BETTER_AUTH_URL || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
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