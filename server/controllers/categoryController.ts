import Category from '../models/Category';

export const getCategories = async (req: any, res: any) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });
  res.json(categories);
};

export const createCategory = async (req: any, res: any) => {
  const { name, slug, icon, parent, description } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required.' });
  }

  const existingCategory = await Category.findOne({ slug });
  if (existingCategory) {
    return res.status(400).json({ message: 'Category with this slug already exists.' });
  }

  const category = await Category.create({ name, slug, icon, parent, description });
  res.status(201).json(category);
};

export const updateCategory = async (req: any, res: any) => {
  const { name, slug, icon, parent, description } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  category.name = name || category.name;
  category.slug = slug || category.slug;
  category.icon = icon || category.icon;
  category.parent = parent ?? category.parent;
  category.description = description || category.description;

  const updatedCategory = await category.save();
  res.json(updatedCategory);
};

export const deleteCategory = async (req: any, res: any) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }
  await category.deleteOne();
  res.json({ message: 'Category removed.' });
};
