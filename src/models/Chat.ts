import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  message: string;
  sender: string;
  receiver: string;
  timestamp: Date;
}
const ChatSchema: Schema = new Schema({
  message: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IChat>("Chat", ChatSchema);
