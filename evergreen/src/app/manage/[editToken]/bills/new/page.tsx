import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BillForm } from "@/components/bill-form";

export default async function NewBillPage({
  params,
}: {
  params: Promise<{ editToken: string }>;
}) {
  const { editToken } = await params;

  return (
    <div>
      <Link
        href={`/manage/${editToken}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
        Back to bills
      </Link>
      <h1 className="mt-3 font-display text-2xl text-foreground">Add a bill</h1>
      <div className="mt-6">
        <BillForm editToken={editToken} />
      </div>
    </div>
  );
}
