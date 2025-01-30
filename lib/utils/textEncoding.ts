export class Text {
    public static Encode(input: string): Uint8Array<ArrayBufferLike> {
        const encoder = new TextEncoder();
        return encoder.encode(input);
    }

    public static Decode(input: Uint8Array<ArrayBufferLike>) {
        const decoder = new TextDecoder();
        return decoder.decode(input);
    }
}
