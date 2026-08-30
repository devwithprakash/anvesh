import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  console.log("Sending email to:", to);

  const result = await resend.emails.send({
    from: "Your App <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  console.log("Resend result:", result);

  return result;
}
