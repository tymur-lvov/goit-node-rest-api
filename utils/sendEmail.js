import nodemailer from 'nodemailer';
import 'dotenv/config';

const { URK_NET_EMAIL, URK_NET_PASSWORD } = process.env;

const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: URK_NET_EMAIL,
    pass: URK_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (data) => {
  const email = { ...data, from: URK_NET_EMAIL };
  return transport.sendMail(email);
};

export default sendEmail;
