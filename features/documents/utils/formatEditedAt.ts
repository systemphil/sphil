const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 365 * 24 * 60 * 60],
    ["month", 30 * 24 * 60 * 60],
    ["week", 7 * 24 * 60 * 60],
    ["day", 24 * 60 * 60],
    ["hour", 60 * 60],
    ["minute", 60],
];

export function relativeTime(iso: string) {
    const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
    const format = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

    for (const [unit, size] of UNITS) {
        if (Math.abs(seconds) >= size) {
            return format.format(Math.round(seconds / size), unit);
        }
    }

    return "just now";
}

/** e.g. "Edited 3 hours ago by Filip". */
export function formatEditedAt(
    iso: string,
    editor: { name: string | null; email: string } | null
) {
    const who = editor ? ` by ${editor.name ?? editor.email}` : "";
    return `Edited ${relativeTime(iso)}${who}`;
}
