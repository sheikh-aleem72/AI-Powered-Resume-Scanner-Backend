import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  PORT: number;
  DB_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER: string;
  SMTP_PASS: string;
  OTP_EXPIRES_MINUTES: number;
}

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const env: EnvConfig = {
  PORT: Number(getEnvVar('PORT')),
  DB_URL: getEnvVar('DB_URL'),
  JWT_ACCESS_SECRET: getEnvVar('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: getEnvVar('JWT_REFRESH_EXPIRES_IN'),
  JWT_ACCESS_EXPIRES_IN: getEnvVar('JWT_ACCESS_EXPIRES_IN'),
  SMTP_HOST: getEnvVar('SMTP_HOST'),
  SMTP_PORT: Number(getEnvVar('SMTP_PORT')),
  SMTP_SECURE: Boolean(getEnvVar('SMTP_SECURE')),
  SMTP_USER: getEnvVar('SMTP_USER'),
  SMTP_PASS: getEnvVar('SMTP_PASS'),
  OTP_EXPIRES_MINUTES: Number(getEnvVar('OTP_EXPIRES_MINUTES')),
};
