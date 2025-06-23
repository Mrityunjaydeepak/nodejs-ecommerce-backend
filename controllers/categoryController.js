import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';

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
export const getCategorySubcategoryTree = async (req, res) => {
  try {
    // 1) load raw data
    const categories   = await Category.find().lean();
    const subcategories = await Subcategory.find().lean();

    // 2) build lookup maps
    const subsByCat = {};    // categoryId → [ subNodes… ]
    const subsById  = {};    // subId        → node

    subcategories.forEach(sub => {
      const catId = sub.category.toString();
      const subId = sub._id.toString();

      // initialize each node with empty children + hasChildren=false
      subsById[subId] = {
        ...sub,
        children:    [],
        hasChildren: false,
      };

      subsByCat[catId] = subsByCat[catId] || [];
      subsByCat[catId].push(subsById[subId]);
    });

    // 3) wire up parent ↔ children and flip hasChildren
    Object.values(subsById).forEach(node => {
      if (node.parent) {
        const parentId = node.parent.toString();
        const parentNode = subsById[parentId];
        if (parentNode) {
          parentNode.children.push(node);
          parentNode.hasChildren = true;
        }
      }
    });

    // 4) assemble final tree
    const result = categories.map(cat => {
      const catId = cat._id.toString();
      const allSubs = subsByCat[catId] || [];

      // only the top‐level subcategories (no parent)
      const rootSubs = allSubs.filter(s => !s.parent);

      return {
        _id:           cat._id,
        name:          cat.name,
        image:         cat.image,
        subcategories: rootSubs,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Error building category-subcategory tree:', err);
    res.status(500).json({ message: 'Server error' });
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