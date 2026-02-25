import NextAuth, {
    type Account,
    type Session,
    type UserWithRole,
} from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "lib/database/dbInit";
import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Role, User } from "@prisma/client";
import type { AdapterUser } from "@auth/core/adapters";
import { cookies } from "next/headers";
import { stripeCreateCustomer } from "lib/stripe/stripeFuncs";
import {
    dbUpdateUserStripeCustomerId,
    dbUpdateUserReferralInfo,
} from "lib/database/dbFuncs";

const isProduction = process.env.NODE_ENV === "production";
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: Role;
            provider: string | null;
            stripeCustomerId?: User["stripeCustomerId"];
        } & DefaultSession["user"];
    }
    interface UserWithRole extends AdapterUser {
        role: Role;
        stripeCustomerId?: User["stripeCustomerId"];
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    adapter: {
        ...PrismaAdapter(prisma),
        createUser: async (user) => {
            /**
             * Override createUser with a round-trip to create
             * stripe customer and return.
             */

            // biome-ignore lint/style/noNonNullAssertion: <Will be replaced by new auth>
            const createdUser = await PrismaAdapter(prisma).createUser!(user);

            let referral: {
                referralId: string;
                couponId?: string | null;
                source?: string | null;
                referredAt?: string | null;
            } | null = null;

            try {
                const cookieStore = await cookies();
                const referralCookie = cookieStore.get("rwl_referral");
                if (referralCookie) {
                    referral = JSON.parse(
                        decodeURIComponent(referralCookie.value)
                    );
                }
            } catch (e) {
                console.error("Failed to read referral cookie:", e);
            }

            const customer = await stripeCreateCustomer({
                email: createdUser.email,
                userId: createdUser.id,
                referralId: referral?.referralId,
            });

            await dbUpdateUserStripeCustomerId({
                userId: createdUser.id,
                stripeCustomerId: customer.id,
            });

            if (referral) {
                try {
                    await dbUpdateUserReferralInfo({
                        userId: createdUser.id,
                        referralId: referral.referralId,
                        couponId: referral.couponId,
                        referralSource: referral.source,
                        referredAt: referral.referredAt
                            ? new Date(referral.referredAt)
                            : null,
                    });
                } catch (e) {
                    console.error("Failed to save referral info:", e);
                }
            }

            // biome-ignore lint/style/noNonNullAssertion: <Will be replaced by new auth>
            const updatedUser = await PrismaAdapter(prisma).getUser!(
                createdUser.id
            );

            if (!updatedUser) {
                throw new Error("Failed to create new user");
            }

            return updatedUser;
        },
    },
    providers: [
        ...(isProduction
            ? [
                  GitHub,
                  Google,
                  Resend({
                      from: process.env.AUTH_EMAIL_FROM,
                  }),
              ]
            : [GitHub]),
    ],
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
        logo: "/sphil_owl.webp",
    },
});
