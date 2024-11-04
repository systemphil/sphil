import { auth } from "lib/auth/authConfig";
import { SignInButton } from "../auth/SignInButton";
import Link from "next/link";
import { SignOutButton } from "../auth/SignOutButton";
import { FadeIn } from "../animations/FadeIn";

export async function UserMenu() {
    const session = await auth();

    if (!session?.user) {
        return <SignInButton className="btn btn-primary btn-sm" />;
    }

    return (
        <div className="dropdown dropdown-bottom dropdown-end">
            <label
                tabIndex={0}
                className="btn btn-circle bg-transparent border-0 shadow-none hover:bg-gray-100 dark:hover:bg-acid-green/10 translate-y-[0.6px]"
            >
                <FadeIn noVertical>
                    <div className="avatar">
                        <div className="w-[26px] rounded-full">
                            {/* eslint-disable-next-line */}
                            <img
                                src={
                                    session?.user.image ??
                                    "/static/images/avatar_placeholder.png"
                                }
                                alt="avatar_picture"
                            />
                        </div>
                    </div>
                </FadeIn>
            </label>
            <ul
                tabIndex={0}
                className="menu dropdown-content p-2 shadow bg-white dark:bg-neutral-900 z-50 rounded-box w-52 drop-shadow-2xl"
            >
                <li>
                    <a className="pointer-events-none cursor-default opacity-75 text-lg pb-0">
                        {session && session.user?.name}
                    </a>
                </li>
                <li>
                    <a className="pointer-events-none cursor-default opacity-75">
                        {session && session.user?.email}
                    </a>
                </li>
                {session && session.user.provider && (
                    <li>
                        <a className="pointer-events-none cursor-default opacity-75">
                            Logged in with {session.user.provider}
                        </a>
                    </li>
                )}
                {session &&
                    (session.user.role === "ADMIN" ||
                        session.user.role === "SUPERADMIN") && (
                        <li className="dark:hover:bg-acid-green/50 rounded-md duration-75 transition-colors">
                            <Link href="/admin">Admin 👑</Link>
                        </li>
                    )}
                <li className="border-t my-1" />
                <li className="dark:hover:bg-acid-green/50 rounded-md duration-75 transition-colors">
                    <Link href="/billing">Account & Billing</Link>
                </li>
                <li className="border-t my-1" />
                <li className="dark:hover:bg-acid-green/50 rounded-md duration-75 transition-colors">
                    <SignOutButton className="w-[157px] flex" />
                </li>
            </ul>
        </div>
    );
}
