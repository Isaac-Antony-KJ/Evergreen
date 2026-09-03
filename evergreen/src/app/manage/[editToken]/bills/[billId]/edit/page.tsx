import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getCalendarByEditToken, getBillById } from "@/lib/queries";
import { BillForm } from "@/components/bill-form";
import { DeleteBillButton } from "@/components/delete-bill-button";

export default async function EditBillPage({
  params,
}: {
  params: Promise<{ editToken: string; billId: string }>;
}) {
  const { editToken, billId } = await params;

  const calendar = await getCalendarByEditToken(editToken);
  if (!calendar) notFound();

  const bill = await getBillById(billId);
  if (!bill || bill.calendar_id !== calendar.id) notFound();

  return (
    <div>
      <Link
        href={`/manage/${editToken}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
        Back to bills
      </Link>
      <h1 className="mt-3 font-display text-2xl text-foreground">Edit bill</h1>
      <div className="mt-6">
        <BillForm editToken={editToken} bill={bill} />
      </div>
      <div className="mt-8 border-t border-border pt-6">
        <DeleteBillButton editToken={editToken} billId={bill.id} billName={bill.name} />
      </div>
    </div>
  );
}
