import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true, 
        requireEmailVerification: false,
    },
    session: {
        expiresIn: 7 * 24 * 60 * 60, // 7 days
    },
    plugins: [
        jwt({
            jwt: {
                expirationTime: "7d",
            },
        }),
    ],
});
