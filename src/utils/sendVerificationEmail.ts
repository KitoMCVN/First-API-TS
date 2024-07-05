import nodemailer from "nodemailer";
import config from "../config";

const sendVerificationEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: config.MAIL_NICKNAME,
    to: email,
    subject: "Account Verification",
    text: `Please verify our account by clicking the following link: ${process.env.BACKEND_URL}/auth/verify-email?verify-token=${token}`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
