import * as z from "zod";

/**
 * The bill form already constrains most of this at the UI level (a 1–31
 * day grid, a fixed set of offset chips), but a server action never trusts
 * the client — this is the real gate.
 */
export const billFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Give this bill a name.")
      .max(80, "Keep the name under 80 characters."),
    day_of_month: z
      .number()
      .int()
      .min(1, "Pick a day between 1 and 31.")
      .max(31, "Pick a day between 1 and 31."),
    enabled: z.boolean(),
    reminder_enabled: z.boolean(),
    reminder_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use a 24-hour HH:MM time."),
    reminder_offset_days: z
      .number()
      .int()
      .min(0, "Offset can't be negative.")
      .max(60, "Pick a smaller offset."),
  })
  .strict();

export type BillFormInput = z.infer<typeof billFormSchema>;
