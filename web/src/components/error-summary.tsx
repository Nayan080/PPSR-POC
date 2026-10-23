import { AlertCircleIcon } from "lucide-react";
import { errorMessages } from "@/api/http";

/** Server-side errors shown above a form, in the style of a government error summary. */
export function ErrorSummary({ error, title = "There is a problem" }: { error: unknown; title?: string }) {
  if (!error) return null;
  const messages = errorMessages(error);
  return (
    <div
      role="alert"
      className="mb-5 rounded-md border border-destructive/40 border-l-4 border-l-destructive bg-destructive/5 p-4"
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
        <AlertCircleIcon className="size-4" />
        {title}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-9 text-sm">
        {messages.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
