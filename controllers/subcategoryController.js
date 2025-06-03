import Subcategory from '../models/Subcategory.js';

// GET /api/subcategories

/** 
 * Existing: GET /api/subcategories?categoryId=… 
 * returns a flat array of subcategories for a given category.
 */
export const getSubcategories = async (req, res) => {
  const { categoryId } = req.query;
  let query = {};

  if (categoryId) {
    query.category = categoryId;
  }

  const subcategories = await Subcategory.find(query)
    .populate('category', 'name')
    .populate('parent', 'name');

  res.json(subcategories);
};

/**
 * NEW: GET /api/subcategories/tree?categoryId=…
 * Returns all subcategories for a given category, nested by parent → children.
 */
export const getSubcategoriesTree = async (req, res) => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      return res
        .status(400)
        .json({ message: 'Please specify ?categoryId=<categoryId>' });
    }

    // 1) Fetch all subcategories for this category in one go
    const allSubs = await Subcategory.find({ category: categoryId })
      .select('_id name image category parent')
      .lean(); // lean() so we get plain JS objects

    // 2) Build a lookup: id → node (with a `children` array)
    const map = {};
    allSubs.forEach((sub) => {
      map[sub._id.toString()] = {
        _id: sub._id.toString(),
        name: sub.name,
        image: sub.image,
        parent: sub.parent ? sub.parent.toString() : null,
        // (we don’t need to send 'category' again, since front‐end already knows it)
        children: [],
      };
    });

    // 3) Populate each node’s `children` array
    const tree = [];
    allSubs.forEach((sub) => {
      const id = sub._id.toString();
      const parentId = sub.parent ? sub.parent.toString() : null;

      if (parentId && map[parentId]) {
        // Attach to its parent’s children
        map[parentId].children.push(map[id]);
      } else {
        // No parent → root‐level subcategory
        tree.push(map[id]);
      }
    });

    // 4) Send back only the root‐level array (with nested children inside)
    return res.json(tree);
  } catch (err) {
    console.error('Error building subcategories tree:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// POST /api/subcategories
export const createSubcategory = async (req, res) => {
  const { name, category, image, parent } = req.body;
  const subcategory = new Subcategory({
    name,
    category,
    image,
    parent: parent || null,
  });

  // Save the new subcategory
  const created = await subcategory.save();

  // Re-query (with populate) before sending response
  const populated = await Subcategory.findById(created._id)
    .populate('category', 'name')
    .populate('parent', 'name');

  res.status(200).json(populated);
};


// PUT /api/subcategories/:id
export const updateSubcategory = async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id);
  if (!subcategory) {
    return res.status(404).json({ message: 'Subcategory not found' });
  }

  subcategory.name     = req.body.name     ?? subcategory.name;
  subcategory.category = req.body.category ?? subcategory.category;
  subcategory.image    = req.body.image    ?? subcategory.image;
  if (req.body.hasOwnProperty('parent')) {
    subcategory.parent = req.body.parent || null;
  }

  const updated = await subcategory.save();
  const populated = await Subcategory.findById(updated._id)
    .populate('category', 'name')
    .populate('parent', 'name');

  res.json(populated);
};

// DELETE /api/subcategories/:id
export const deleteSubcategory = async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id);
  if (!subcategory) {
    return res.status(404).json({ message: 'Subcategory not found' });
  }
  await subcategory.remove();
  res.json({ message: 'Subcategory removed' });
};
