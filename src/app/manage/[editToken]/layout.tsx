import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Share2 } from "lucide-react";
import { getCalendarByEditToken } from "@/lib/queries";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function ManageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ editToken: string }>;
}) {
  const { editToken } = await params;
  const calendar = await getCalendarByEditToken(editToken);

  if (!calendar) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5">
      <header className="flex items-center justify-between py-5">
        <Link href={`/manage/${editToken}`}>
          <Logo />
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href={`/manage/${editToken}/share`}
            aria-label="Calendar sharing and subscription"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-foreground transition-colors hover:bg-accent"
          >
            <Share2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 pb-16">{children}</main>
    </div>
  );
}
