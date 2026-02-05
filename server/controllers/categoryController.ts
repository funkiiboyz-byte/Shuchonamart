import Category from '../models/Category';

// Fix: Use 'any' for req and res to resolve property access issues with query, status, and json
export const getCategories = async (req: any, res: any) => {
  const categories = await Category.find({}).sort({ name: 1 });
  res.json(categories);
};

// Fix: Use 'any' for req and res to resolve property access issues with body, status, and json
export const createCategory = async (req: any, res: any) => {
  const { name, icon, parent, description } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  const exists = await Category.findOne({ slug });
  if (exists) {
    return res.status(400).json({ message: 'Category already exists' });
  }

  const category = await Category.create({ name, slug, icon, parent: parent || null, description });
  res.status(201).json(category);
};

// Fix: Use 'any' for req and res to resolve property access issues with params, body, status, and json
export const updateCategory = async (req: any, res: any) => {
  const { name, icon, parent, description } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  if (name) {
    category.name = name;
    category.slug = name.toLowerCase().replace(/\s+/g, '-');
  }
  category.icon = icon ?? category.icon;
  category.parent = parent ?? category.parent;
  category.description = description ?? category.description;

  const updatedCategory = await category.save();
  res.json(updatedCategory);
};

// Fix: Use 'any' for req and res to resolve property access issues with params, status, and json
export const deleteCategory = async (req: any, res: any) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  await category.deleteOne();
  res.json({ message: 'Category removed' });
};
