import { Resend } from "resend";

let _resend = null;
function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM = process.env.RESEND_FROM_EMAIL || "admin@modelmanagement.mu";
const ADMIN_EMAIL = "info@modelmanagement.mu";

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
    await resend.emails.send({ from: FROM, to, subject, text });
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

export { ADMIN_EMAIL as CONTACT_TO };
