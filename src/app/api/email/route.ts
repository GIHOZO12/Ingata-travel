import { timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";

// Email relay for the backend. Render's free tier blocks outbound SMTP, but
// Vercel doesn't — so the API builds each email (templates, invite links,
// ...) and POSTs it here over HTTPS, and this route hands it to SMTP.
//
// It is NOT public: every request must carry the shared EMAIL_RELAY_SECRET,
// otherwise anyone could use our mail account to send spam.

// nodemailer needs Node APIs (sockets), not the Edge runtime.
export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      // true for port 465, false for 587/25 (STARTTLS)
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    })
  : null;

function isAuthorized(request: Request): boolean {
  const secret = process.env.EMAIL_RELAY_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization") ?? "";
  const given = Buffer.from(header.replace(/^Bearer\s+/i, ""));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!transporter) {
    console.error("[email] SMTP_HOST is not set; cannot send");
    return Response.json({ error: "Email is not configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const to = typeof body?.to === "string" ? body.to.trim() : "";
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const html = typeof body?.html === "string" ? body.html : "";
  const replyTo = typeof body?.replyTo === "string" ? body.replyTo.trim() : "";

  if (!EMAIL.test(to) || !subject || !html || (replyTo && !EMAIL.test(replyTo))) {
    return Response.json(
      { error: "Expected { to, subject, html, replyTo? } with valid email addresses" },
      { status: 400 },
    );
  }

  const companyName = process.env.COMPANY_NAME || "Ingata Travel";
  const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER;

  try {
    const info = await transporter.sendMail({
      from: `${companyName} <${fromAddress}>`,
      to,
      subject,
      html,
      ...(replyTo && { replyTo }),
    });
    console.log(`[email] sent: "${subject}" to ${to} (id ${info.messageId})`);
    return Response.json({ id: info.messageId });
  } catch (error) {
    console.error(
      `[email] failed to send "${subject}" to ${to}:`,
      error instanceof Error ? error.message : error,
    );
    return Response.json({ error: "Failed to send email" }, { status: 502 });
  }
}
