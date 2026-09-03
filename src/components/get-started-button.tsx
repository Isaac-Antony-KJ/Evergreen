"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast";
import { createCalendar } from "@/app/actions";

export function GetStartedButton({ className }: { className?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await createCalendar();
      if (!result.ok) {
        toast(result.error);
        return;
      }
      router.push(`/manage/${result.data.editToken}`);
    });
  }

  return (
    <Button onClick={handleClick} disabled={isPending} className={className}>
      {isPending ? "Setting things up…" : "Create your bill calendar"}
    </Button>
  );
}
