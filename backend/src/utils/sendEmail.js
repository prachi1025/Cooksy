import nodemailer from "nodemailer";

export const isEmailConfigured = () => {
  return Boolean(
    process.env.EMAIL_HOST &&
      process.env.EMAIL_PORT &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS
  );
};

export const sendEmail = async ({ to, subject, html }) => {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || user;

  if (!isEmailConfigured()) {
    console.warn("Email is not configured (missing EMAIL_* env vars).");
    // Don't leak reset tokens/links in production logs
    if (process.env.NODE_ENV !== "production") {
      console.log("Email debug (dev only):", { to, subject, html });
    } else {
      console.log("Email skipped (prod):", { to, subject });
    }
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass }
    });

    await transporter.sendMail({
      from,
      to,
      subject,
      html
    });
  } catch (err) {
    console.error("Email send failed, but continuing:", err?.message || err);
  }
};

