import bcrypt from 'bcryptjs';

/** Generate a 6-digit numeric OTP as string */
export const generateOtp = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

/** Hash OTP (bcrypt) */
export const hashOtp = async (otp: string): Promise<string> => {
  const salt = await bcrypt.genSalt(8);
  return bcrypt.hash(otp, salt);
};

/** Compare OTP with stored hash */
export const verifyOtpHash = async (otp: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(otp, hash);
};
