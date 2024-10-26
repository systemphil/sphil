import { auth } from "lib/auth/authConfig";
import { Suspense } from "react";

export default async function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
        </Suspense>
    );
}

async function Dashboard() {
    const session = await auth();

    if (!session?.user)
        return (
            <div>
                <p>You need to be signed in to access the dashboard</p>
            </div>
        );

    return (
        <div>
            <img
                src={session.user.image as string | undefined}
                alt="User Avatar"
            />
        </div>
    );
}
