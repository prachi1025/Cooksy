import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || user;

  if (!host || !port || !user || !pass) {
    console.warn(
      "Email credentials are not fully configured. Skipping real email send."
    );
    console.log("Email that would be sent:", { to, subject, html });
    return;
  }

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
};

