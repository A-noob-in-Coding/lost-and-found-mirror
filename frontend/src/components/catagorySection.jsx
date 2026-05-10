import React, { useState } from "react";
import {
  MdAdd,
  MdModeEdit,
  MdDelete,
  MdSave,
  MdCancel,
} from "react-icons/md";
import { BiCategory } from "react-icons/bi";

const CategoryContainer = ({ categories, loading, onAddCategory, onUpdateCategory, onDeleteCategory, processingId }) => {
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState({ id: null, name: "" });
  const [isEditing, setIsEditing] = useState(false);
  // Start editing a category
  const startEdit = (category) => {
    setIsEditing(true);
    setEditCategory({ id: category.category_id, name: category.category });
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
    setEditCategory({ id: null, name: "" });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory);
      setNewCategory("");
    }
  }

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (editCategory.name.trim()) {
      onUpdateCategory(editCategory.id, editCategory.name);
      setIsEditing(false);
      setEditCategory({ id: null, name: "" });
    }
  }

  return (
    <section className="mb-6 sm:mb-10 bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
        Manage Categories
      </h2>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-2">
        <div className="relative flex-1">
          <BiCategory className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
            required
          />
        </div>
        <button
          type="submit"
          disabled={!!processingId}
          className="bg-black text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-md hover:bg-gray-800 transition-transform duration-200 hover:scale-105 hover:shadow-md flex items-center justify-center gap-2 font-medium text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processingId === 'add_category' ? <i className="fas fa-spinner fa-spin"></i> : <MdAdd size={18} />}
          Add Category
        </button>
      </form>

      {/* Edit Category Form */}
      {isEditing && (
        <form
          onSubmit={handleUpdateCategory}
          className="mb-6 sm:mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-800">
            <MdModeEdit className="text-yellow-500" />
            Edit Category
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <div className="relative flex-1">
              <BiCategory className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={editCategory.name}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!!processingId}
                className="flex-1 sm:flex-initial bg-green-600 text-white px-4 py-2.5 sm:py-2 rounded-md hover:bg-green-700 transition-transform duration-200 hover:scale-105 hover:shadow-md flex items-center justify-center gap-2 font-medium text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingId === `update_category_${editCategory.id}` ? <i className="fas fa-spinner fa-spin"></i> : <MdSave size={18} />}
                Save
              </button>

              <button
                type="button"
                onClick={cancelEdit}
                disabled={!!processingId}
                className="flex-1 sm:flex-initial bg-gray-600 text-white px-4 py-2.5 sm:py-2 rounded-md hover:bg-gray-700 transition-transform duration-200 hover:scale-105 hover:shadow-md flex items-center justify-center gap-2 font-medium text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdCancel size={18} />
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Categories List - Improved with Grid/Flex */}
      {loading ? (
        <div className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
          Loading categories...
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Header - Hidden on mobile, shown on larger screens */}
          <div className="hidden sm:flex flex-row justify-between bg-gray-100 rounded-t-lg py-3 px-4 font-semibold text-gray-700 text-sm">
            <div className="w-16">ID</div>
            <div className="flex-1">Category Name</div>
            <div className="w-32 text-right">Actions</div>
          </div>

          {/* Body */}
          <div className="divide-y divide-gray-200">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.category_id}
                  className="flex flex-col sm:flex-row sm:justify-between hover:bg-gray-50 p-4 sm:py-3 sm:px-4 gap-3 sm:gap-0 sm:items-center border-b sm:border-b-0"
                >
                  {/* Mobile Layout */}
                  <div className="sm:hidden">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-500">ID: {category.category_id}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(category)}
                          className="bg-yellow-500 text-white py-1.5 px-2.5 rounded hover:bg-yellow-600 transition-transform duration-200 hover:scale-105 hover:shadow-md flex items-center gap-1 text-sm"
                        >
                          <MdModeEdit size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteCategory(category.category_id)}
                          disabled={!!processingId}
                          className="bg-red-500 text-white px-2.5 py-1.5 rounded hover:bg-red-600 transition-transform duration-200 hover:scale-105 hover:shadow-md flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === `delete_category_${category.category_id}` ? <i className="fas fa-spinner fa-spin"></i> : <MdDelete size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="font-medium text-gray-800">{category.category}</div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex sm:w-full sm:justify-between sm:items-center">
                    <div className="w-16 text-gray-800 text-sm">{category.category_id}</div>
                    <div className="flex-1 text-gray-800 text-sm font-medium">
                      {category.category}
                    </div>
                    <div className="w-32 flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(category)}
                        className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition-transform duration-200 hover:scale-105 hover:shadow-md flex items-center gap-1"
                      >
                        <MdModeEdit size={18} />
                      </button>
                      <button
                        onClick={() => onDeleteCategory(category.category_id)}
                        disabled={!!processingId}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-transform duration-200 hover:scale-105 hover:shadow-md flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === `delete_category_${category.category_id}` ? <i className="fas fa-spinner fa-spin"></i> : <MdDelete size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base">
                No categories found. Add a category to get started.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default CategoryContainer;
