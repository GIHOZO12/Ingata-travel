import { randomUUID, timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";

// Email relay for the backend. Render's free tier blocks outbound SMTP, but
// Vercel doesn't — so the API builds each email (templates, invite links,
// ...) and POSTs it here over HTTPS, and this route hands it to SMTP.
//
// It is NOT public: every request must carry the shared EMAIL_RELAY_SECRET,
// otherwise anyone could use our mail account to send spam.
//
// Every log line starts with "[email <id>]" so one request can be followed
// through Vercel's logs (filter on "[email"). The same id is returned to the
// backend, which logs it too.

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

// Which settings are missing — named in the logs, never their values.
function missingConfig(): string[] {
  return ["EMAIL_RELAY_SECRET", "SMTP_HOST", "SMTP_USER", "SMTP_PASS"].filter(
    (key) => !process.env[key],
  );
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.EMAIL_RELAY_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization") ?? "";
  const given = Buffer.from(header.replace(/^Bearer\s+/i, ""));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

// nodemailer errors carry the SMTP details that explain most failures
// (e.g. code EAUTH / responseCode 535 = wrong Gmail app password).
function describeSmtpError(error: unknown) {
  if (!(error instanceof Error)) return { message: String(error) };
  const e = error as Error & {
    code?: string;
    responseCode?: number;
    response?: string;
    command?: string;
  };
  return {
    message: e.message,
    code: e.code,
    responseCode: e.responseCode,
    response: e.response,
    command: e.command,
  };
}

export async function POST(request: Request) {
  const id = randomUUID().slice(0, 8);
  const log = (msg: string, ...rest: unknown[]) => console.log(`[email ${id}] ${msg}`, ...rest);
  const fail = (msg: string, ...rest: unknown[]) => console.error(`[email ${id}] ${msg}`, ...rest);
  const started = Date.now();

  if (!isAuthorized(request)) {
    if (!process.env.EMAIL_RELAY_SECRET) {
      fail("rejected: EMAIL_RELAY_SECRET is not set on this deployment");
    } else {
      fail(
        `rejected: bad or missing Authorization header (from ${request.headers.get("x-forwarded-for") ?? "unknown"}) — check the backend's EMAIL_RELAY_SECRET matches`,
      );
    }
    return Response.json({ id, error: "Unauthorized" }, { status: 401 });
  }

  if (!transporter) {
    fail(`cannot send: missing settings ${missingConfig().join(", ")}`);
    return Response.json({ id, error: "Email is not configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const to = typeof body?.to === "string" ? body.to.trim() : "";
  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const html = typeof body?.html === "string" ? body.html : "";
  const replyTo = typeof body?.replyTo === "string" ? body.replyTo.trim() : "";

  const problems = [
    !body && "body is not valid JSON",
    !EMAIL.test(to) && `invalid "to" (${to || "empty"})`,
    !subject && "missing subject",
    !html && "missing html",
    replyTo && !EMAIL.test(replyTo) && `invalid "replyTo" (${replyTo})`,
  ].filter(Boolean);
  if (problems.length > 0) {
    fail(`bad request: ${problems.join("; ")}`);
    return Response.json(
      { id, error: `Expected { to, subject, html, replyTo? }: ${problems.join("; ")}` },
      { status: 400 },
    );
  }

  const companyName = process.env.COMPANY_NAME || "Ingata Travel";
  const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER;
  log(`sending "${subject}" to ${to} via ${process.env.SMTP_HOST}:${process.env.SMTP_PORT || 587}`);

  try {
    const info = await transporter.sendMail({
      from: `${companyName} <${fromAddress}>`,
      to,
      subject,
      html,
      ...(replyTo && { replyTo }),
    });
    log(
      `sent "${subject}" to ${to} in ${Date.now() - started}ms`,
      { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected, response: info.response },
    );
    return Response.json({ id, messageId: info.messageId });
  } catch (error) {
    const details = describeSmtpError(error);
    fail(`FAILED "${subject}" to ${to} after ${Date.now() - started}ms`, details);
    // Returned to the backend (authorized callers only) so its logs show the cause too.
    return Response.json({ id, error: "Failed to send email", details }, { status: 502 });
  }
}
