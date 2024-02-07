import mongoose, { Document, Schema } from "mongoose";

export interface IDocument extends Document {
  title: string;
  content: string;
  owner: mongoose.Schema.Types.ObjectId;
  collaborators: mongoose.Schema.Types.ObjectId[];
}

const DocumentSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<IDocument>("Document", DocumentSchema);
