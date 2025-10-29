import { EmailService } from "lib/email/EmailService";
import { cacheKeys } from "lib/server/cache";
import { processTranscription } from "lib/transcribe/transcribeFuncs";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: Request) {
    const authHeader = req.headers.get("x-internal-key");

    if (authHeader === process.env.TRANSCRIBE_API_KEY) {
        const payload = await req.json();

        try {
            await processTranscription(payload);
            revalidatePath("/(admin)/admin", "layout");
            revalidateTag(cacheKeys.allPublicCourses);
        } catch (e) {
            console.error("Transcription failed:", e);
            EmailService.adminAlert({ message: e });
        }

        return new Response("OK");
    } else {
        return new Response(null, { status: 403 });
    }
}
