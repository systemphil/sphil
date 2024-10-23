import LandingPage from "@/components/pages/landing";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "sPhil",
};

export default function IndexPage() {
    return <LandingPage />;
}
