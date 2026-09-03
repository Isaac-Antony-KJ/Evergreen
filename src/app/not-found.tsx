import Link from "next/link";
import { Compass } from "lucide-react";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-8">
        <Logo />
      </div>
      <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Compass className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <h1 className="font-display text-2xl text-foreground">This link isn&apos;t valid</h1>
      <p className="mx-auto mt-2 max-w-sm text-[0.95rem] text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist, or the link may have been
        regenerated. Check that you have the latest link, or start fresh below.
      </p>
      <Link
        href="/"
        className="mt-7 inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-primary px-5 text-[0.95rem] font-medium text-primary-foreground shadow-[var(--shadow-paper)] transition-opacity hover:opacity-90"
      >
        Go to the homepage
      </Link>
    </main>
  );
}
