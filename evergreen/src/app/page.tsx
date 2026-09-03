import { CalendarCheck, PencilLine, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { GetStartedButton } from "@/components/get-started-button";
import { LedgerIllustration } from "@/components/ledger-illustration";
import { APP_NAME } from "@/lib/constants";

const STEPS = [
  {
    title: "Add your bills",
    body: "Name each one, pick a due day, and set a reminder if you want one.",
  },
  {
    title: "Subscribe once",
    body: "Copy your link into Apple Calendar, Google Calendar, or Outlook.",
  },
  {
    title: "It stays current",
    body: "Edit or add bills anytime on the site — your calendar updates itself.",
  },
];

const FEATURES = [
  {
    icon: CalendarCheck,
    title: "Works with the calendar you already use",
    body: "No new app to check. Your bills just show up alongside everything else.",
  },
  {
    icon: PencilLine,
    title: "One source of truth",
    body: "Bills are only ever edited here, so what your calendar shows is always accurate.",
  },
  {
    icon: ShieldCheck,
    title: "A private link, not a public page",
    body: "Your calendar lives behind a long, unguessable link — share it only with your household.",
  },
];

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col px-6">
      <header className="flex items-center justify-between py-6">
        <Logo />
        <ThemeToggle />
      </header>

      <section className="grid gap-14 py-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
        <div className="max-w-xl">
          <h1 className="font-display text-[2.5rem] leading-[1.1] text-foreground sm:text-5xl">
            Set your bills once. Then forget about them.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            {APP_NAME} turns your recurring bills into a calendar subscription — one link
            that keeps Apple, Google, or Outlook Calendar current on its own.
          </p>
          <div className="mt-8">
            <GetStartedButton />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No account needed to start. Takes about a minute.
          </p>
        </div>
        <LedgerIllustration />
      </section>

      <section className="border-t border-border py-16">
        <h2 className="font-display text-2xl text-foreground">How it works</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="font-display text-2xl text-primary">{index + 1}</span>
              <h3 className="mt-2 font-medium text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-[0.95rem] text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-accent text-accent-foreground">
                <feature.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-medium text-foreground">{feature.title}</h3>
              <p className="mt-1.5 text-[0.95rem] text-muted-foreground">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-auto border-t border-border py-8 text-sm text-muted-foreground">
        {APP_NAME}. Your bills, on your terms.
      </footer>
    </main>
  );
}
