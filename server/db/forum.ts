import mongoose from "mongoose";

const ForumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    createdBy: { type: String, required: true }
});

export const ForumModal = mongoose.model("Forum", ForumSchema);

export const createForum = (values: Record<string, any>) => new ForumModal(values).save().then((forum) => forum.toObject());