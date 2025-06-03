import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};

// GET /api/categories
// Returns each category + up to `limit` of its subcategories (default: 10)
export const getCategoriesWithSubs = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;

  // use aggregation to slice the array in the database
  const categories = await Category.aggregate([
    {
      $project: {
        name: 1,
        image: 1,                   // whatever other fields you need
        subcategories: { $slice: ['$subcategories', limit] }
      }
    }
  ]);

  res.json(categories);
};
// GET /api/categories-with-subcats
export const getCategoriesWithSubcats = async (req, res) => {
  const cats = await Category.find({});
  const results = await Promise.all(cats.map(async cat => {
    const subs = await Subcategory.find({ category: cat._id })
      .limit(10)
      .select('name image');
    return {
      _id: cat._id,
      name: cat.name,
      image: cat.image,
      subcategories: subs
    };
  }));
  res.json(results);
};

// GET /api/categories/:id/subcategories
export const getAllSubcatsByCategory = async (req, res) => {
  const subs = await Subcategory.find({ category: req.params.id })
    .select('name image');
  res.json(subs);
};
/**
 * GET /api/categories/tree
 * Returns a nested array of all categories and subcategories in a single JSON tree.
 */
export const getCategoriesTree = async (req, res) => {
  try {
    // 1) Load all categories (only the fields we need: _id, name, image, parent)
    const allCats = await Category.find({})
      .select('_id name image parent')
      .lean(); // lean() returns plain JS objects instead of Mongoose documents

    // 2) Build a lookup map: id → node-with-children
    const map = {};
    allCats.forEach(cat => {
      const id = cat._id.toString();
      map[id] = {
        _id: id,
        name: cat.name,
        image: cat.image,
        parent: cat.parent ? cat.parent.toString() : null,
        children: []
      };
    });

    // 3) Iterate again and attach each node to its parent's `children[]`
    const tree = [];
    allCats.forEach(cat => {
      const id = cat._id.toString();
      const parentId = cat.parent ? cat.parent.toString() : null;

      if (parentId && map[parentId]) {
        // If parent exists, push this node under its parent
        map[parentId].children.push(map[id]);
      } else {
        // If parent is null or not found, it’s a root
        tree.push(map[id]);
      }
    });

    // 4) Send back the array of root nodes (with nested `children`)
    return res.json(tree);
  } catch (err) {
    console.error('Error building categories tree:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/categories/:id/subcategories
// Returns *all* subcategories for one category
export const getAllSubcategories = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id).select('subcategories');

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.json(category.subcategories);
};

export const createCategory = async (req, res) => {
  const { name, image } = req.body;
  const category = new Category({ name, image });
  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
};

export const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    category.name = req.body.name || category.name;
    category.image = req.body.image || category.image;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    await category.remove();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
};