"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast";
import { deleteBill } from "@/app/manage/[editToken]/actions";

export function DeleteBillButton({
  editToken,
  billId,
  billName,
}: {
  editToken: string;
  billId: string;
  billName: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteBill(editToken, billId);
      if (!result.ok) {
        toast(result.error);
        return;
      }
      toast("Bill deleted");
      router.push(`/manage/${editToken}`);
      router.refresh();
    });
  }

  if (confirming) {
    return (
      <div className="rounded-[var(--radius-md)] border border-danger/40 bg-danger/5 p-4">
        <p className="text-sm text-foreground">Delete {billName} for good? This can&apos;t be undone.</p>
        <div className="mt-3 flex gap-2">
          <Button variant="danger" size="sm" onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Deleting…" : "Yes, delete it"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirming(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => setConfirming(true)} className="text-danger">
      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
      Delete bill
    </Button>
  );
}
