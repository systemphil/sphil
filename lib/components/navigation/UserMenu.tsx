import { auth } from "lib/auth/authConfig";
import { SignInButton } from "../auth/SignInButton";
import Link from "next/link";
import { SignOutButton } from "../auth/SignOutButton";

export async function UserMenu() {
    const session = await auth();

    if (!session?.user) {
        return <SignInButton />;
    }

    return (
        <div className="dropdown dropdown-bottom dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="avatar">
                    <div className="w-7 rounded-full">
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
            </label>
            <ul
                tabIndex={0}
                className="menu dropdown-content z-[1] p-2 shadow bg-white rounded-box w-52 drop-shadow-2xl"
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
                <li className="border-t my-1" />
                <li>
                    <Link href="/billing">Account & Billing</Link>
                </li>
                <li className="border-t my-1" />
                <li>
                    <SignOutButton className="w-[155px] flex" />
                </li>
            </ul>
        </div>
    );
}
