import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  link: { type: String },
}, { _id: true });

const BannerCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  banners: [BannerSchema],
}, { timestamps: true });

export default mongoose.model('BannerCategory', BannerCategorySchema);