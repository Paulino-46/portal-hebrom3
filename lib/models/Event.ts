import mongoose, { Model, Schema } from "mongoose";

export interface EventDocument extends mongoose.Document {
  title: string;
  description: string;
  location: string;
  date: Date;
  time: string;
  image: string;
}

const EventSchema = new Schema<EventDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Event = (mongoose.models.Event as Model<EventDocument>) || mongoose.model<EventDocument>("Event", EventSchema);

export default Event;
