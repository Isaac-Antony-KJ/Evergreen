import { notFound } from "next/navigation";
import { Apple, Calendar as CalendarIcon, Mail } from "lucide-react";
import { getCalendarByEditToken } from "@/lib/queries";
import { getBaseUrl } from "@/lib/server-utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/copy-button";
import { RegenerateTokenButton } from "@/components/regenerate-token-button";

export default async function SharePage({
  params,
}: {
  params: Promise<{ editToken: string }>;
}) {
  const { editToken } = await params;
  const calendar = await getCalendarByEditToken(editToken);
  if (!calendar) notFound();

  const baseUrl = await getBaseUrl();
  const subscriptionUrl = `${baseUrl}/calendar/${calendar.secure_token}.ics`;
  const webcalUrl = subscriptionUrl.replace(/^https?:\/\//, "webcal://");

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground">Subscribe to your calendar</h1>
      <p className="mt-1.5 text-[0.95rem] text-muted-foreground">
        This link is read-only — bills are always edited here on the site.
      </p>

      <Card className="mt-6 p-4">
        <label htmlFor="subscription-url" className="text-sm font-medium text-secondary-foreground">
          Subscription link
        </label>
        <div className="mt-2 flex items-center gap-2">
          <Input
            id="subscription-url"
            readOnly
            value={subscriptionUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="font-mono text-xs sm:text-sm"
          />
          <CopyButton value={subscriptionUrl} />
        </div>
      </Card>

      <div className="mt-8 space-y-6">
        <h2 className="font-display text-lg text-foreground">Add it to your calendar</h2>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent text-accent-foreground">
              <Apple className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="font-medium text-foreground">Apple Calendar</h3>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            On iPhone, iPad, or Mac, tap the button below and confirm the subscription when
            your device prompts you.
          </p>
          <a
            href={webcalUrl}
            className="mt-3 inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Add to Apple Calendar
          </a>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent text-accent-foreground">
              <CalendarIcon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="font-medium text-foreground">Google Calendar</h3>
          </div>
          <ol className="mt-3 list-decimal space-y-1 pl-4 text-sm text-muted-foreground">
            <li>Copy the subscription link above.</li>
            <li>
              On the Google Calendar website, open <strong className="font-medium text-foreground">Other calendars</strong> and choose{" "}
              <strong className="font-medium text-foreground">Subscribe from URL</strong>.
            </li>
            <li>Paste the link and select Add calendar.</li>
          </ol>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent text-accent-foreground">
              <Mail className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="font-medium text-foreground">Outlook</h3>
          </div>
          <ol className="mt-3 list-decimal space-y-1 pl-4 text-sm text-muted-foreground">
            <li>Copy the subscription link above.</li>
            <li>
              In Outlook, choose <strong className="font-medium text-foreground">Add calendar</strong> then{" "}
              <strong className="font-medium text-foreground">Subscribe from web</strong>.
            </li>
            <li>Paste the link and finish adding it.</li>
          </ol>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg text-foreground">Reset your link</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Create a new subscription link if you think this one has been shared too widely.
        </p>
        <div className="mt-3">
          <RegenerateTokenButton editToken={editToken} />
        </div>
      </div>
    </div>
  );
}
