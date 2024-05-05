import nodemailer from 'nodemailer';

export const sendEmail = async options => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // Define email options
  const emailOptions = {
    from: '"Majid Ali" <noreply@demomailtrap.com>',
    to: options.email,
    subject: options.subject,
    text: options.text
  };

  // Actually send the mail

  const info = await transporter.sendMail(emailOptions);
};
