import mongoose, { Model, Schema } from "mongoose";

export interface NewsDocument extends mongoose.Document {
  title: string;
  summary: string;
  content: string;
  author: string;
  image: string;
  createdAt: Date;
}

const NewsSchema = new Schema<NewsDocument>(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const News = (mongoose.models.News as Model<NewsDocument>) || mongoose.model<NewsDocument>("News", NewsSchema);

export default News;
