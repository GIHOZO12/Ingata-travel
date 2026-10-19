
export default function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/);

  return (
    <div className="space-y-5 text-zinc-700">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="pt-2 text-lg font-semibold text-zinc-900">
              {trimmed.slice(4)}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="pt-4 text-2xl font-semibold text-zinc-900">
              {trimmed.slice(3)}
            </h2>
          );
        }

        const rows = trimmed.split("\n");
        if (rows.every((row) => row.trim().startsWith("- "))) {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {rows.map((row, i) => (
                <li key={i}>{row.trim().slice(2)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="whitespace-pre-line leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
