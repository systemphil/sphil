import type { TranscribeParams, Transcript } from "assemblyai";
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

    const ts = await transcribeWithRetry(params);

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

const MAX_ATTEMPTS = 4;
const BASE_DELAY_MS = 5_000;

/**
 * AssemblyAI error messages describing a problem with the file itself. Retrying these
 * can never succeed, so we fail immediately instead of burning attempts.
 */
const PERMANENT_ERROR_PATTERNS = [
    /max_content_length/i,
    /does not appear to contain audio/i,
    /unsupported/i,
    /transcoding failed/i,
];

class PermanentTranscriptionError extends Error {}

async function transcribeWithRetry(params: TranscribeParams): Promise<Transcript> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            const ts = await transcribeClient.transcripts.transcribe(params);
            if (ts.status === "completed") return ts;
            const message = `Transcript ${ts.id} ended with status '${ts.status}': ${ts.error ?? "no error message"}`;
            if (PERMANENT_ERROR_PATTERNS.some((p) => p.test(ts.error ?? ""))) {
                throw new PermanentTranscriptionError(message);
            }
            throw new Error(message);
        } catch (e) {
            lastError = e;
            if (e instanceof PermanentTranscriptionError) {
                throw new Error(
                    `Transcription failed on attempt ${attempt} with a non-retryable error`,
                    { cause: e }
                );
            }
            if (attempt === MAX_ATTEMPTS) break;
            const delay = BASE_DELAY_MS * 2 ** (attempt - 1) * (0.5 + Math.random());
            console.warn(
                `⚠️ Transcription attempt ${attempt}/${MAX_ATTEMPTS} failed, retrying in ${Math.round(delay / 1000)}s:`,
                e
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    throw new Error(`Transcription failed after ${MAX_ATTEMPTS} attempts`, {
        cause: lastError,
    });
}

function toTimestamp(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
