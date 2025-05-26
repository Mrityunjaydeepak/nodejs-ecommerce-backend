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