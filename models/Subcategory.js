// models/Subcategory.js
import mongoose from 'mongoose';

const SubcategorySchema = new mongoose.Schema({
  name:       { type: String, required: true },
  image:      { type: String },
  category:   { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  parent:     { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', default: null },
}, { timestamps: true });

/**
 * Static helper: given an array of parent IDs, returns an object
 * mapping each parent ID to the count of direct children it has.
 */
SubcategorySchema.statics.getChildrenCountMap = async function(parentIds) {
  if (!parentIds.length) return {};
  const results = await this.aggregate([
    { $match: { parent: { $in: parentIds.map(id => mongoose.Types.ObjectId(id)) } } },
    { $group: { _id: '$parent', count: { $sum: 1 } } }
  ]);
  const map = {};
  results.forEach(r => {
    map[r._id.toString()] = r.count;
  });
  return map;
};

export default mongoose.model('Subcategory', SubcategorySchema);
