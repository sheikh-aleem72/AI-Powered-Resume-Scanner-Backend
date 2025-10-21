import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1️⃣ Define the User interface for TypeScript
import { Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId; // ✅ explicitly declare _id
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'recruiter';
  organization?: string;
  premium: boolean;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 2️⃣ Create the User schema
const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'recruiter'], default: 'recruiter' },
    organization: { type: String, default: null },
    premium: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true },
);

// 3️⃣ Pre-save hook to hash password
userSchema.pre<IUser>('save', async function (next) {
  console.log('Pre save function is getting called!');
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log('Inside user schema Hash 1:', this.password);
  next();
});

// 4️⃣ Method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 5️⃣ Create the User model
export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
