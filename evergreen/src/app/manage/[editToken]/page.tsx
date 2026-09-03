import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck, Plus } from "lucide-react";
import { getCalendarByEditToken, getBillsForCalendar } from "@/lib/queries";
import { BillList } from "@/components/bill-list";
import { EmptyState } from "@/components/empty-state";
import { Card } from "@/components/ui/card";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ editToken: string }>;
}) {
  const { editToken } = await params;
  const calendar = await getCalendarByEditToken(editToken);
  if (!calendar) notFound();

  const bills = await getBillsForCalendar(calendar.id);
  const enabledCount = bills.filter((b) => b.enabled).length;
  const disabledCount = bills.length - enabledCount;

  let subtitle = "Add a bill to get started.";
  if (bills.length > 0 && disabledCount === 0) {
    subtitle = `${enabledCount} bill${enabledCount === 1 ? "" : "s"} on your calendar`;
  } else if (bills.length > 0) {
    subtitle = `${enabledCount} bill${enabledCount === 1 ? "" : "s"} on your calendar, ${disabledCount} turned off`;
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground">{calendar.name}</h1>
      <p className="mt-1 text-[0.95rem] text-muted-foreground">{subtitle}</p>

      {bills.length > 0 && (
        <Link
          href={`/manage/${editToken}/share`}
          className="mt-6 flex items-center gap-3.5 rounded-[var(--radius-lg)] border border-border bg-surface p-4 transition-colors hover:border-primary"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent text-accent-foreground">
            <CalendarCheck className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <span className="min-w-0">
            <span className="block font-medium text-foreground">Your calendar is ready</span>
            <span className="block text-sm text-muted-foreground">
              Subscribe once and it stays current on its own
            </span>
          </span>
        </Link>
      )}

      <div className="mt-6">
        {bills.length === 0 ? (
          <EmptyState editToken={editToken} />
        ) : (
          <Card className="p-4">
            <BillList bills={bills} editToken={editToken} />
          </Card>
        )}
      </div>

      <Link
        href={`/manage/${editToken}/bills/new`}
        aria-label="Add a bill"
        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-paper-lg)] transition-opacity hover:opacity-90"
      >
        <Plus className="h-6 w-6" strokeWidth={2} />
      </Link>
    </div>
  );
}
