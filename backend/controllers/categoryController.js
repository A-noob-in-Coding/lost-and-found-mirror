import * as categoryService from '../service/categoryService.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories' });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving category' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    try {
      const checkQuery = await categoryService.getAllCategories();
      const exists = checkQuery.some(item => item.category.toLowerCase() === category.toLowerCase());

      if (exists) {
        return res.status(400).json({ message: 'Category already exists' });
      }
    } catch (checkError) {
    }

    await categoryService.createCategory({ category });
    res.status(201).json({ message: 'Category added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const updatedCategory = await categoryService.updateCategory(id, { category });

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (updatedCategory.error === true) {
      return res.status(400).json({ message: 'Error in updating' });
    }

    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);

    if (!result) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (result.error === true) {
      return res.status(400).json({ message: result.message });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};
