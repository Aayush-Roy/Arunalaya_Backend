import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or "outlook", etc.
      auth: {
        user: process.env.EMAIL_USER, // your Gmail ID
        pass: process.env.EMAIL_PASS, // app password (not your Gmail password)
      },
    });

    const mailOptions = {
      from: `"Wanderlust Services" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};
