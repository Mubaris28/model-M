import { Resend } from "resend";

let _resend = null;
function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM = process.env.RESEND_FROM_EMAIL || "admin@modelmanagement.mu";
const ADMIN_EMAIL = "info@modelmanagement.mu";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function linkifySafeHtml(safeText) {
  const urlRegex = /(https?:\/\/[^\s<]+)/gi;
  return safeText.replace(urlRegex, (url) => {
    const escapedUrl = escapeHtml(url);
    return `<a href="${escapedUrl}" style="color:#ff1f3d;text-decoration:underline;word-break:break-all">${escapedUrl}</a>`;
  });
}

function firstUrl(text) {
  const m = String(text || "").match(/https?:\/\/[^\s]+/i);
  return m ? m[0] : "";
}

function textToHtmlBlocks(text) {
  const blocks = String(text || "").trim().split(/\n{2,}/).filter(Boolean);
  return blocks
    .map((block) => {
      const safe = linkifySafeHtml(escapeHtml(block)).replace(/\n/g, "<br />");
      return `<p style="margin:0 0 14px 0;color:#222;line-height:1.65;font-size:15px;font-family:Arial,Helvetica,sans-serif">${safe}</p>`;
    })
    .join("");
}

function buildBrandEmailHtml({ subject, text }) {
  const bodyBlocks = textToHtmlBlocks(text);
  const ctaUrl = firstUrl(text);
  const cta = ctaUrl
    ? `<tr>
        <td style="padding:6px 0 22px 0">
          <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:#ff1f3d;border:1px solid #ff1f3d;color:#ffffff;text-decoration:none;padding:11px 20px;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;border-radius:999px">Open Link</a>
        </td>
      </tr>`
    : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#fff3f5">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:radial-gradient(circle at top,#ffd9df 0%,#fff3f5 46%,#f7f8fa 100%);padding:28px 12px">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #ffd7dd;border-radius:20px;overflow:hidden;box-shadow:0 12px 34px rgba(178,0,32,0.12)">
            <tr>
              <td style="background:linear-gradient(135deg,#b30020 0%,#ff1f3d 55%,#ff6b82 100%);padding:22px 24px 20px 24px;border-radius:20px 20px 0 0">
                <div style="display:inline-block;color:#ffffff;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.35);border-radius:999px;padding:4px 10px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase">Model Management</div>
                <div style="color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;line-height:1.35;margin-top:10px">${escapeHtml(subject)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 24px 14px 24px">${bodyBlocks}</td>
            </tr>
            ${cta}
            <tr>
              <td style="padding:18px 24px 24px 24px;border-top:1px solid #ffe6ea">
                <p style="margin:0;color:#777;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6">
                  This email was sent by Model Management.<br />
                  For support, contact <a href="mailto:info@modelmanagement.mu" style="color:#ff1f3d;text-decoration:underline">info@modelmanagement.mu</a>.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildPasswordResetUrl(token) {
  const template = process.env.PASSWORD_RESET_URL_TEMPLATE || "";
  const fallbackBase = process.env.PASSWORD_RESET_URL_BASE || "";

  if (template.includes("{{token}}")) {
    return template.replace("{{token}}", encodeURIComponent(token));
  }
  if (fallbackBase) {
    const sep = fallbackBase.includes("?") ? "&" : "?";
    return `${fallbackBase}${sep}token=${encodeURIComponent(token)}`;
  }
  return `http://localhost:3000/reset-password?token=${encodeURIComponent(token)}`;
}

async function send({ to, subject, text }) {
  const resend = getResend();
  if (!resend) {
    console.warn(`Email skipped (RESEND_API_KEY not set): "${subject}" → ${to}`);
    return false;
  }
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject,
      text,
      html: buildBrandEmailHtml({ subject, text }),
    });
    return true;
  } catch (err) {
    console.error(`Email send failed [${subject}]:`, err.message);
    return false;
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function sendPasswordResetEmail({ to, fullName, token }) {
  const resetUrl = buildPasswordResetUrl(token);
  const name = fullName?.trim() || "there";
  return send({
    to,
    subject: "Reset your password — Model Management",
    text: [
      `Hi ${name},`,
      "",
      "You requested a password reset. Click the link below to set a new password:",
      "",
      resetUrl,
      "",
      "This link expires in 1 hour.",
      "",
      "If you did not request this, you can safely ignore this email.",
      "",
      "———",
      "Model Management",
      "info@modelmanagement.mu",
    ].join("\n"),
  });
}

export async function sendNewUserNotification({ fullName, email, role }) {
  const roleLabel = role === "model" ? "Model" : role === "professional" ? "Professional" : "User";
  return send({
    to: ADMIN_EMAIL,
    subject: `New ${roleLabel} application — ${fullName || email}`,
    text: [
      "A new application has been submitted and is awaiting review.",
      "",
      `Name:  ${fullName || "N/A"}`,
      `Email: ${email}`,
      `Role:  ${roleLabel}`,
      "",
      "Please log in to the admin panel to review this application.",
      "",
      "———",
      "Model Management",
      "info@modelmanagement.mu",
    ].join("\n"),
  });
}

// ─── User status ──────────────────────────────────────────────────────────────

export async function sendUserApprovedEmail({ to, fullName }) {
  const name = fullName?.trim() || "there";
  return send({
    to,
    subject: "Your application has been approved — Model Management",
    text: [
      `Hi ${name},`,
      "",
      "Congratulations! Your application has been approved.",
      "",
      "You can now log in and access your full profile on Model Management.",
      "",
      "———",
      "Model Management",
      "info@modelmanagement.mu",
    ].join("\n"),
  });
}

export async function sendUserRejectedEmail({ to, fullName, reason }) {
  const name = fullName?.trim() || "there";
  const reasonBlock = reason?.trim()
    ? ["\nReason:", reason.trim(), ""]
    : [""];
  return send({
    to,
    subject: "Your application status — Model Management",
    text: [
      `Hi ${name},`,
      "",
      "Thank you for your interest in Model Management.",
      "Unfortunately, your application has not been approved at this time.",
      ...reasonBlock,
      "If you have any questions, please contact us at info@modelmanagement.mu.",
      "",
      "———",
      "Model Management",
      "info@modelmanagement.mu",
    ].join("\n"),
  });
}

// ─── Castings ─────────────────────────────────────────────────────────────────

export async function sendCastingSubmittedNotification({ creatorName, creatorEmail, castingTitle }) {
  return send({
    to: ADMIN_EMAIL,
    subject: `New casting submitted for review — ${castingTitle}`,
    text: [
      "A new casting has been submitted and is awaiting your approval.",
      "",
      `Casting:      ${castingTitle}`,
      `Submitted by: ${creatorName || "N/A"} (${creatorEmail})`,
      "",
      "Please log in to the admin panel to approve or reject this casting.",
      "",
      "———",
      "Model Management",
      "info@modelmanagement.mu",
    ].join("\n"),
  });
}

export async function sendCastingApprovedEmail({ to, fullName, castingTitle }) {
  const name = fullName?.trim() || "there";
  return send({
    to,
    subject: `Your casting has been approved — ${castingTitle}`,
    text: [
      `Hi ${name},`,
      "",
      `Your casting "${castingTitle}" has been approved and is now live on the platform.`,
      "",
      "Models can now discover and apply to your casting.",
      "",
      "———",
      "Model Management",
      "info@modelmanagement.mu",
    ].join("\n"),
  });
}

export async function sendCastingRejectedEmail({ to, fullName, castingTitle, reason }) {
  const name = fullName?.trim() || "there";
  const reasonBlock = reason?.trim()
    ? ["\nReason:", reason.trim(), ""]
    : [""];
  return send({
    to,
    subject: `Your casting was not approved — ${castingTitle}`,
    text: [
      `Hi ${name},`,
      "",
      `Unfortunately your casting "${castingTitle}" has not been approved at this time.`,
      ...reasonBlock,
      "If you have any questions, please contact us at info@modelmanagement.mu.",
      "",
      "———",
      "Model Management",
      "info@modelmanagement.mu",
    ].join("\n"),
  });
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function sendModelAppliedNotification({ modelName, modelEmail, castingTitle }) {
  return send({
    to: ADMIN_EMAIL,
    subject: `New casting application — ${modelName || modelEmail}`,
    text: [
      "A model has submitted an application for a casting.",
      "",
      `Model:   ${modelName || "N/A"} (${modelEmail})`,
      `Casting: ${castingTitle}`,
      "",
      "Please log in to the admin panel to review the application.",
      "",
      "———",
      "Model Management",
      "info@modelmanagement.mu",
    ].join("\n"),
  });
}

export async function sendModelSuggestedEmail({ to, professionalName, modelName, castingTitle }) {
  const name = professionalName?.trim() || "there";
  return send({
    to,
    subject: `Model suggested for your casting — ${castingTitle}`,
    text: [
      `Hi ${name},`,
      "",
      "The Model Management team has suggested a model for your casting.",
      "",
      `Model:   ${modelName}`,
      `Casting: ${castingTitle}`,
      "",
      "Please log in to your dashboard to review the suggested model.",
      "",
      "———",
      "Model Management",
      "info@modelmanagement.mu",
    ].join("\n"),
  });
}

export async function sendApplicationRejectedEmail({ to, modelName, castingTitle }) {
  const name = modelName?.trim() || "there";
  return send({
    to,
    subject: `Your casting application was not selected — ${castingTitle}`,
    text: [
      `Hi ${name},`,
      "",
      `Thank you for applying to "${castingTitle}".`,
      "Unfortunately, your application was not selected at this time.",
      "",
      "Keep an eye on new castings — there may be a great fit for you soon.",
      "",
      "———",
      "Model Management",
      "info@modelmanagement.mu",
    ].join("\n"),
  });
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function sendBookingNotificationToModel({ to, modelName, castingTitle, professionalName, notes }) {
  const name = modelName?.trim() || "there";
  const notesBlock = notes?.trim() ? [`\nNotes: ${notes.trim()}`, ""] : [""];
  return send({
    to,
    subject: `You have been booked — ${castingTitle}`,
    text: [
      `Hi ${name},`,
      "",
      "Congratulations! You have been booked for a casting.",
      "",
      `Casting:   ${castingTitle}`,
      `Booked by: ${professionalName || "N/A"}`,
      ...notesBlock,
      "Please log in to your dashboard for more details.",
      "",
      "———",
      "Model Management",
      "info@modelmanagement.mu",
    ].join("\n"),
  });
}

export async function sendBookingNotificationToAdmin({ modelName, modelEmail, professionalName, professionalEmail, castingTitle }) {
  return send({
    to: ADMIN_EMAIL,
    subject: `Model booked — ${castingTitle}`,
    text: [
      "A model has been booked for a casting.",
      "",
      `Casting:      ${castingTitle}`,
      `Model:        ${modelName || "N/A"} (${modelEmail})`,
      `Booked by:    ${professionalName || "N/A"} (${professionalEmail})`,
      "",
      "———",
      "Model Management",
      "info@modelmanagement.mu",
    ].join("\n"),
  });
}

// ─── Contact form ─────────────────────────────────────────────────────────────

export async function sendContactEmail({ name, email, message }) {
  return send({
    to: ADMIN_EMAIL,
    subject: `Contact form — ${name}`,
    text: [
      "New contact form submission.",
      "",
      `Name:  ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
      "",
      "———",
      "Model Management",
      "info@modelmanagement.mu",
    ].join("\n"),
  });
}

export async function sendContactConfirmationEmail({ to, name }) {
  const person = name?.trim() || "there";
  return send({
    to,
    subject: "We received your message — Model Management",
    text: [
      `Hi ${person},`,
      "",
      "Thank you for contacting Model Management.",
      "",
      "This is a confirmation that we have received your form submission.",
      "Our team will review it and get back to you within 48 hours.",
      "",
      "If your request is urgent, you can also reach us at info@modelmanagement.mu.",
      "",
      "———",
      "Model Management",
      "info@modelmanagement.mu",
    ].join("\n"),
  });
}

export { ADMIN_EMAIL as CONTACT_TO };
