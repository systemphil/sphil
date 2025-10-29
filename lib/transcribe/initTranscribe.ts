import { AssemblyAI } from "assemblyai";

export const transcribeClient = new AssemblyAI({
    apiKey: process.env.TRANSCRIBE_API_KEY as string,
});
