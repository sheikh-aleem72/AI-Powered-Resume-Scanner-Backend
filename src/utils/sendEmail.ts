import nodemailer from 'nodemailer';
import { env } from '../config/serverConfig'; // your env access

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: env.SMTP_SECURE, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

/** send otp mail - simple html/text template */
export const sendOtpEmail = async (to: string, otp: string, purpose: 'signup' | 'reset') => {
  transporter.verify((error, success) => {
    if (error) console.error('SMTP connection failed:', error);
    else console.log('SMTP Server is ready to take messages');
  });
  const subject = purpose === 'signup' ? 'Your signup verification OTP' : 'Your password reset OTP';

  const text = `Your verification code is: ${otp}. It expires in ${env.OTP_EXPIRES_MINUTES} minutes.`;

  const html = `<p>Your verification code is: <b>${otp}</b></p>
                <p>This code will expire in ${env.OTP_EXPIRES_MINUTES} minute(s).</p>`;

  await transporter.sendMail({
    from: env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
};
