import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  jsonTransport: true,
});

export default transporter;