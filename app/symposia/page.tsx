import { SymposiaLanding } from "features/marketing/components/SymposiaLanding";

export const metadata = {};

export const dynamic = "force-dynamic";

export default async function SymposiaPage() {
    return <SymposiaLanding />;
}
