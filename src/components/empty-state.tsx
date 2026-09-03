import Link from "next/link";
import { NotebookPen } from "lucide-react";

export function EmptyState({ editToken }: { editToken: string }) {
  return (
    <div className="flex flex-col items-center rounded-[var(--radius-lg)] border border-dashed border-border px-6 py-16 text-center">
      <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <NotebookPen className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <h2 className="font-display text-xl text-foreground">No bills yet</h2>
      <p className="mx-auto mt-2 max-w-xs text-[0.95rem] text-muted-foreground">
        Add the bills you pay every month and Evergreen will keep your calendar current from
        here on.
      </p>
      <Link
        href={`/manage/${editToken}/bills/new`}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-primary px-5 text-[0.95rem] font-medium text-primary-foreground shadow-[var(--shadow-paper)] transition-opacity hover:opacity-90"
      >
        Add your first bill
      </Link>
    </div>
  );
}
