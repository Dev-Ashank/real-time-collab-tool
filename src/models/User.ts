import mongoose, { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  profilePicture: string;
  dateOfBirth: Date;
  bio: string;
}

const userSchema: Schema = new Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "default_profile_picture_url" },
  dateOfBirth: { type: Date },
  bio: { type: String, maxlength: 500 },
});
// Hash the password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
