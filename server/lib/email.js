import nodemailer from "nodemailer";

const CONTACT_TO = process.env.CONTACT_TO_EMAIL || (process.env.ADMIN_EMAILS || "").split(",")[0]?.trim() || "mubarismuhammed33@gmail.com";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

/**
 * Send contact form submision to the configured email (CONTACT_TO_EMAIL or first ADMIN_EMAILS).
 * Returns true if sent, false if SMTP not configured (message still saved to DB).
 */
export async function sendContactEmail({ name, email, message }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("Contact: SMTP not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS). Message saved to DB only. Would send to:", CONTACT_TO);
    return false;
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@modelmanagement.com",
      to: CONTACT_TO,
      replyTo: email,
      subject: `[Model Management] Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>`,
    });
    return true;
  } catch (err) {
    console.error("Contact email send failed:", err.message);
    return false;
  }
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

  return `http://localhost:5173/reset-password?token=${encodeURIComponent(token)}`;
}

export async function sendPasswordResetEmail({ to, fullName, token }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("Password reset: SMTP not configured. Reset email was not sent.");
    return false;
  }

  const resetUrl = buildPasswordResetUrl(token);
  const safeName = fullName?.trim() || "there";

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@modelmanagement.com",
      to,
      subject: "Reset your password",
      text: `Hi ${safeName},\n\nUse this link to reset your password:\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you did not request this, you can ignore this email.`,
      html: `<p>Hi ${safeName},</p><p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour.</p><p>If you did not request this, you can ignore this email.</p>`,
    });
    return true;
  } catch (err) {
    console.error("Password reset email send failed:", err.message);
    return false;
  }
}

export { CONTACT_TO };
