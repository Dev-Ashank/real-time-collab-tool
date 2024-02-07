import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  message: string;
  sender: mongoose.Schema.Types.ObjectId;
  receiver: mongoose.Schema.Types.ObjectId;
  timestamp: Date;
}
const ChatSchema: Schema = new Schema({
  message: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IChat>("Chat", ChatSchema);
