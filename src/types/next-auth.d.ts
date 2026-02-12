import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string;
            username: string;
            role: "USER" | "ADMIN";
            createdAt: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        username: string;
        role: "USER" | "ADMIN";
        createdAt: string;
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        id: string;
        username: string;
        role: "USER" | "ADMIN";
        createdAt: string;
    }
}
