import mongoose, { Schema, Document } from "mongoose";

export interface IGuestInvite {
  _id?: string;
  name: string;
  familySuffix?: string;
  customNote?: string;
  famSignOff?: string;
  url: string;
  createdAt: Date;
}

export interface IWedding extends Document {
  userId: mongoose.Types.ObjectId;
  slug: string;
  templateId: string; // Open string to dynamically support any registry template ID
  bride: {
    name: string;
    parents: string;
    image: string;
    traits?: string[];
  };
  groom: {
    name: string;
    parents: string;
    image: string;
    traits?: string[];
  };
  couple: {
    title?: string;
    image: string;
    quote?: string;
  };
  event: {
    dateText: string;
    timeText: string;
    isoDate: Date;
    venueTitle: string;
    venueAddress: string;
    googleMapsUrl: string;
  };
  musicUrl?: string;
  defaultFamilySignOff: string;
  isPublished: boolean;
  guestInvites: IGuestInvite[];
  createdAt: Date;
  updatedAt: Date;
}

const GuestInviteSchema = new Schema<IGuestInvite>({
  name: { type: String, required: true },
  familySuffix: { type: String },
  customNote: { type: String },
  famSignOff: { type: String },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const WeddingSchema = new Schema<IWedding>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    templateId: { type: String, required: true, default: "design-one", trim: true },
    bride: {
      name: { type: String, required: true },
      parents: { type: String, required: true },
      image: { type: String, required: true },
      traits: [{ type: String }],
    },
    groom: {
      name: { type: String, required: true },
      parents: { type: String, required: true },
      image: { type: String, required: true },
      traits: [{ type: String }],
    },
    couple: {
      title: { type: String, default: "The Royal Union" },
      image: { type: String, required: true },
      quote: { type: String, default: "Different hearts. Different worlds. One beautiful destiny." },
    },
    event: {
      dateText: { type: String, required: true },
      timeText: { type: String, required: true },
      isoDate: { type: Date, required: true },
      venueTitle: { type: String, required: true },
      venueAddress: { type: String, required: true },
      googleMapsUrl: { type: String, required: true },
    },
    musicUrl: { type: String, default: "/audio/royal-shehnai.mp3" },
    defaultFamilySignOff: { type: String, default: "Royal Family" },
    isPublished: { type: Boolean, default: true },
    guestInvites: [GuestInviteSchema],
  },
  { timestamps: true }
);

const Wedding = mongoose.models.Wedding || mongoose.model<IWedding>("Wedding", WeddingSchema);
export default Wedding;