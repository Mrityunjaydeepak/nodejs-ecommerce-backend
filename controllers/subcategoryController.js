// controllers/subcategoryController.js
import Subcategory from '../models/Subcategory.js';

// GET /api/subcategories
export const getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const query = {};
    if (categoryId) query.category = categoryId;

    // 1) fetch flat list
    const subs = await Subcategory.find(query)
      .populate('category', 'name')
      .populate('parent', 'name')
      .lean();

    // 2) build hasChildren map
    const ids = subs.map(s => s._id.toString());
    const countMap = await Subcategory.getChildrenCountMap(ids);

    // 3) attach flag
    const result = subs.map(s => ({
      ...s,
      hasChildren: Boolean(countMap[s._id.toString()]),
    }));

    return res.json(result);
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/subcategories/tree
export const getSubcategoriesTree = async (req, res) => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      return res
        .status(400)
        .json({ message: 'Please specify ?categoryId=<categoryId>' });
    }

    // 1) fetch all in one go
    const allSubs = await Subcategory.find({ category: categoryId })
      .select('_id name image category parent')
      .lean();

    // 2) build lookup map with children & flag
    const map = {};
    allSubs.forEach(sub => {
      const id = sub._id.toString();
      map[id] = {
        _id: id,
        name: sub.name,
        image: sub.image,
        parent: sub.parent ? sub.parent.toString() : null,
        children: [],
        hasChildren: false,
      };
    });

    // 3) link up parent → children and set hasChildren
    allSubs.forEach(sub => {
      const id = sub._id.toString();
      const p = sub.parent ? sub.parent.toString() : null;
      if (p && map[p]) {
        map[p].children.push(map[id]);
        map[p].hasChildren = true;
      }
    });

    // 4) grab only root‐level items
    const tree = [];
    Object.values(map).forEach(node => {
      if (!node.parent) tree.push(node);
    });

    return res.json(tree);
  } catch (err) {
    console.error('Error building subcategories tree:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * NEW: GET /api/subcategories/subtree
 * Returns the full subtree rooted at the given subCategoryId.
 * Expects: ?subCategoryId=<id>
 */
export const getSubcategorySubtree = async (req, res) => {
  try {
    const { subCategoryId } = req.query;
    if (!subCategoryId) {
      return res
        .status(400)
        .json({ message: 'Please specify ?subCategoryId=<subCategoryId>' });
    }

    // 1) fetch the root subcategory to get its category
    const rootSub = await Subcategory.findById(subCategoryId).lean();
    if (!rootSub) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    const categoryId = rootSub.category.toString();

    // 2) fetch all subcategories in that category
    const allSubs = await Subcategory.find({ category: categoryId })
      .select('_id name image category parent')
      .lean();

    // 3) build lookup map with children & flag
    const map = {};
    allSubs.forEach(sub => {
      const id = sub._id.toString();
      map[id] = {
        _id: id,
        name: sub.name,
        image: sub.image,
        parent: sub.parent ? sub.parent.toString() : null,
        children: [],
        hasChildren: false,
      };
    });

    // 4) link up parent → children and set hasChildren
    allSubs.forEach(sub => {
      const id = sub._id.toString();
      const p = sub.parent ? sub.parent.toString() : null;
      if (p && map[p]) {
        map[p].children.push(map[id]);
        map[p].hasChildren = true;
      }
    });

    // 5) extract and return just the requested subtree
    const subtree = map[subCategoryId];
    return res.json(subtree);
  } catch (err) {
    console.error('Error building subcategory subtree:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/subcategories
export const createSubcategory = async (req, res) => {
  try {
    const { name, category, image, parent } = req.body;
    const subcategory = new Subcategory({
      name,
      category,
      image,
      parent: parent || null,
    });

    const created = await subcategory.save();
    const populated = await Subcategory.findById(created._id)
      .populate('category', 'name')
      .populate('parent', 'name');

    const obj = populated.toObject();
    obj.hasChildren = false;   // brand‐new → no children yet
    return res.status(200).json(obj);
  } catch (err) {
    console.error('Error creating subcategory:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/subcategories/:id
export const updateSubcategory = async (req, res) => {
  try {
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

    const obj = populated.toObject();
    const childExists = await Subcategory.exists({ parent: populated._id });
    obj.hasChildren = Boolean(childExists);

    return res.json(obj);
  } catch (err) {
    console.error('Error updating subcategory:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/subcategories/:id
export const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    await subcategory.remove();
    return res.json({ message: 'Subcategory removed' });
  } catch (err) {
    console.error('Error deleting subcategory:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
