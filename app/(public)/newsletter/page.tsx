import { SubscribeToNewsletter } from "features/marketing/components/SubscribeToNewsletter";
import { Heading } from "lib/components/ui/Heading";
import { Paragraph } from "lib/components/ui/Paragraph";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import { ScreenWrapper } from "lib/components/ui/ScreenWrapper";

export default function NewsletterPage() {
    return (
        <ScreenWrapper className="flex flex-col justify-start md:justify-center items-center pt-6">
            <MarkEmailUnreadOutlinedIcon fontSize="large" />
            <Heading>Newsletter</Heading>
            <Paragraph className="mb-6">
                Subscribe to our newsletter to stay up to date on new events.
            </Paragraph>
            <div className="max-w-[500px]">
                <SubscribeToNewsletter />
            </div>
        </ScreenWrapper>
    );
}
