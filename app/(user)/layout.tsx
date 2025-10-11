import { auth } from "lib/auth/authConfig";
import { redirect } from "next/navigation";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        return redirect("/?missing=login");
    }

    return <div data-pagefind-ignore>{children}</div>;
}
