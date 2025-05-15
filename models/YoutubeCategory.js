import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url:  { type: String, required: true },
  description: { type: String },
}, { _id: true });

const YoutubeCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  videos: [VideoSchema],
}, { timestamps: true });

export default mongoose.model('YoutubeCategory', YoutubeCategorySchema);