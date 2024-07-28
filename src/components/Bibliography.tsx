import BibliographyData from "../data/bibliography.json";

type BibliographyComponentEntry = `${string}, ${number}${string | undefined}`;

/**
 * @example <Bibliography entries={["Hegel, 2010", "Burbidge, 1981"]} />
 */
export function Bibliography({
    entries,
}: {
    entries: BibliographyComponentEntry[];
}) {
    const bibliographyData = BibliographyData.toSorted();
    const output: string[] = [];

    bibliographyData.forEach((bibEntry) => {
        for (const incEntry of entries) {
            const authorLastName = incEntry.split(",")[0];
            const year = incEntry.split(",")[1];

            if (
                bibEntry.startsWith(authorLastName) &&
                bibEntry.includes(year)
            ) {
                output.push(bibEntry);
            }
        }
    });

    // Alternative using regex: entry.replace(/_(.*?)_/g, "<i>$1</i>"

    return (
        <div>
            <h2>Bibliography</h2>
            <ul>
                {output.map((entry) => (
                    <li key={entry}>
                        {entry.split("_").map((part, index) => {
                            if (index % 2 === 0) {
                                return <span key={index}>{part}</span>;
                            } else {
                                return <em key={index}>{part}</em>;
                            }
                        })}
                    </li>
                ))}
            </ul>
        </div>
    );
}
