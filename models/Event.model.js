import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date },
    organizer: { type: String, required: true },
    imageUrl: { type: String },
    tags: [{ type: String, index: true }],
    location: {
      name: { type: String, required: true },
      address: { type: String },
      city: { type: String, index: true },
      country: { type: String, index: true },
      coordinates: {
        lat: Number,
        lng: Number
      },
      placeId: { type: String },
      mapUrl: { type: String }
    },
    isCustom: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
