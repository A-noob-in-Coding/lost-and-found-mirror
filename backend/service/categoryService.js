import CategoryModel from '../model/CategoryModel.js';

export const getAllCategories = async () => {
  return await CategoryModel.getAll();
};

export const getCategoryById = async (id) => {
  return await CategoryModel.getById(id);
};

export const createCategory = async ({ category }) => {
  try {
    return await CategoryModel.create(category);
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'category_category_key') {
      throw new Error('Category name already exists');
    }
    console.error('Error in createCategory service:', error);
    throw error;
  }
};

export const updateCategory = async (id, { category }) => {
  if (id == 1) {
    return { error: true, message: "Cannot modify the default category" };
  }
  return await CategoryModel.update(id, category);
};

export const deleteCategory = async (id) => {
  if (id == 1) {
    return { error: true, message: "Cannot delete the default category" };
  }
  return await CategoryModel.delete(id);
};
