import type { TranscribeParams } from "assemblyai";
import { transcribeClient } from "./initTranscribe";
import { dbUpsertLessonTranscriptById } from "lib/database/dbFuncs";

export async function processTranscription({
    transcriptId,
    parentId,
    fileUrl,
}: {
    transcriptId: string | null;
    parentId: string;
    fileUrl: string;
}) {
    console.info(
        `⚙️ Transcription start for ${fileUrl} | Parent ID: ${parentId} transcriptId: ${transcriptId}`
    );
    const params = {
        audio: fileUrl,
        speech_model: "universal" as const,
    } satisfies TranscribeParams;

    const ts = await transcribeClient.transcripts.transcribe(params);

    const paragraphsResp = await transcribeClient.transcripts.paragraphs(ts.id);

    const plainTextContent = paragraphsResp.paragraphs
        .map(
            (p) => `(${toTimestamp(p.start)} - ${toTimestamp(p.end)}) ${p.text}`
        )
        .join("\n\n");

    const payload = {
        id: transcriptId ?? undefined,
        lessonId: parentId,
        transcript: plainTextContent,
        shouldCompile: true,
    };

    await dbUpsertLessonTranscriptById(payload);
    console.info(
        `✅ Transcript ${paragraphsResp.id} should be saved to db. Parent (lesson) ID: ${parentId} Transcript ID ${transcriptId}`
    );
}

function toTimestamp(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
