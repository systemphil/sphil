import NextAuth, { Account, Session, UserWithRole } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "lib/database/dbInit";
import { type DefaultSession } from "next-auth";
import { type JWT } from "next-auth/jwt";
import { type Role, User } from "@prisma/client";
import type { AdapterUser } from "@auth/core/adapters";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: Role;
            provider: string | null;
            stripeCustomerId?: User["stripeCustomerId"];
            productsPurchased?: User["productsPurchased"];
        } & DefaultSession["user"];
    }
    interface UserWithRole extends AdapterUser {
        role: Role;
        stripeCustomerId?: User["stripeCustomerId"];
        productsPurchased?: User["productsPurchased"];
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    adapter: PrismaAdapter(prisma),
    providers: [GitHub],
    callbacks: {
        session: ({
            session,
            user,
            token,
        }: {
            session: Session;
            user: AdapterUser & {
                role?: Role;
                stripeCustomerId?: User["stripeCustomerId"];
                productsPurchased?: User["productsPurchased"];
            };
            token: JWT;
        }) => ({
            expires: session.expires,
            user: {
                ...session.user,
                id: user.id,
                role: user.role as Role,
                provider: token?.provider,
            },
        }),
        jwt: async ({
            token,
            user,
            account,
        }: {
            token: JWT;
            user: UserWithRole;
            account: Account | null;
        }) => {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.provider = account?.provider;
            }
            return token;
        },
    },
    theme: {
        colorScheme: "light",
        brandColor: "#AA336A",
        // TODO fix logo source
        logo: "https://avatars.githubusercontent.com/u/147748257?s=200&v=4",
    },
});
