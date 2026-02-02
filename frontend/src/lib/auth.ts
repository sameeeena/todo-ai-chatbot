import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
    database: new Database("auth.db"),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: false,
    },    session: {
        strategy: "jwt",
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
