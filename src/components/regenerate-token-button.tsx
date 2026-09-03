"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast";
import { regenerateSecureToken } from "@/app/manage/[editToken]/actions";

export function RegenerateTokenButton({ editToken }: { editToken: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  function handleConfirm() {
    startTransition(async () => {
      const result = await regenerateSecureToken(editToken);
      setConfirming(false);
      if (!result.ok) {
        toast(result.error);
        return;
      }
      toast("New subscription link created");
      router.refresh();
    });
  }

  if (confirming) {
    return (
      <div className="rounded-[var(--radius-md)] border border-danger/40 bg-danger/5 p-4">
        <p className="text-sm text-foreground">
          Calendars already subscribed to the old link will stop updating. Everyone will need
          the new link.
        </p>
        <div className="mt-3 flex gap-2">
          <Button variant="danger" size="sm" onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Generating…" : "Yes, create a new link"}
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
    <Button variant="secondary" size="sm" onClick={() => setConfirming(true)}>
      <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
      Regenerate link
    </Button>
  );
}
