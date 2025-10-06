import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  PORT: number;
  DB_URL: string;
  JWT_SECRET: string;
}

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const env: EnvConfig = {
  PORT: Number(getEnvVar('PORT')),
  DB_URL: getEnvVar('DB_URL'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
};
