import { InferId } from "mongoose";

require("dotenv").config();
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

let mailOptions = {
  from: `"KitoMC"`,
  to: "lolkito59@gmail.com",
  subject: "Hello ✔",
  text: "Hello world?",
  html: "<p>Hello world? aaaaaaaađasad</b>",
};

transporter.sendMail(mailOptions, (error: Error, info: any) => {
  if (error) {
    return console.log(error);
  }
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});
