import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  registrationDate: Date;
  nickname?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "USER" },
  registrationDate: { type: Date, default: Date.now },
  nickname: { type: String },
  dateOfBirth: { type: Date },
  phoneNumber: { type: String },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
