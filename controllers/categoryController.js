// controllers/category.js
import mongoose from 'mongoose';
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
  const categories = await Category.aggregate([
    {
      $project: {
        name: 1,
        image: 1,
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
    const categories    = await Category.find().lean();
    const subcategories = await Subcategory.find().lean();

    const subsByCat = {};
    const subsById  = {};

    // build lookup nodes
    subcategories.forEach(sub => {
      const catId = sub.category.toString();
      const subId = sub._id.toString();
      subsById[subId] = { ...sub, children: [], hasChildren: false };
      subsByCat[catId] = subsByCat[catId] || [];
      subsByCat[catId].push(subsById[subId]);
    });

    // wire up parent ↔ children
    Object.values(subsById).forEach(node => {
      if (node.parent) {
        const parentNode = subsById[node.parent.toString()];
        if (parentNode) {
          parentNode.children.push(node);
          parentNode.hasChildren = true;
        }
      }
    });

    // assemble per‐category tree
    const result = categories.map(cat => {
      const allSubs = subsByCat[cat._id.toString()] || [];
      const rootSubs = allSubs.filter(s => !s.parent);
      return {
        _id: cat._id,
        name: cat.name,
        image: cat.image,
        subcategories: rootSubs
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Error building category-subcategory tree:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/categories/:id/subcategories
// Returns *all* subcategories array stored on the Category document
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
    category.name  = req.body.name  || category.name;
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

// ——— New “next‐level” endpoints ———

// GET /api/subcategories/:id/children
// Returns only the immediate child subcategories of the given subcategory
export const getSubcategoryChildren = async (req, res) => {
  try {
    const parentId = req.params.id;
    const children = await Subcategory.find({ parent: parentId })
      .select('name image parent')
      .lean();
    res.json(children);
  } catch (err) {
    console.error('Error fetching subcategory children', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/subcategories/:id/descendants
// Returns *all* descendant subcategories (any depth) under the given node
export const getSubcategoryDescendants = async (req, res) => {
  try {
    const subcatId = mongoose.Types.ObjectId(req.params.id);
    const [result] = await Subcategory.aggregate([
      { $match: { _id: subcatId } },
      {
        $graphLookup: {
          from: 'subcategories',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parent',
          as: 'descendants',
          depthField: 'level'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          descendants: {
            _id: 1,
            name: 1,
            parent: 1,
            level: 1
          }
        }
      }
    ]);

    if (!result) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.json(result.descendants);
  } catch (err) {
    console.error('Error fetching full descendant tree', err);
    res.status(500).json({ message: 'Server error' });
  }
};
