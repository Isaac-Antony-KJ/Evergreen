"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const { toast } = useToast();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      toast("Copied to clipboard");
    } catch {
      toast("Couldn't copy — select and copy the link manually");
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleCopy}>
      <Copy className="h-4 w-4" strokeWidth={1.75} />
      {label}
    </Button>
  );
}
