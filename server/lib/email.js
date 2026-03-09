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
 * Send contact form submission to the configured email (CONTACT_TO_EMAIL or first ADMIN_EMAILS).
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

export { CONTACT_TO };
