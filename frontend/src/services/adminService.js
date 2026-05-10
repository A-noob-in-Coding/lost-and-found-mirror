
import API from "./api.js";

export const adminService = {
  loginAdmin: async (username, password, captchaToken) => {
    try {
      const response = await API.post("/api/users/loginAdmin", {
        username,
        password,
        captchaToken,
      });
      // Store admin token in localStorage
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Admin login failed" };
    }
  },
  logoutAdmin: () => {
    localStorage.removeItem('adminToken');
  },
  fetchPosts: async () => {
    try {
      const response = await API.get(`/api/admin/posts`)
      return response.data
    } catch (error) {

      throw error.response?.data || { message: "Could not fetch admin posts" };
    }
  },
  fetchAllPosts: async () => {
    try {
      const response = await API.get(`/api/admin/posts/all`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Could not fetch all posts" };
    }
  },
  deletePost: async (id, type) => {
    try {
      const normalizedType = type.toLowerCase();
      const endpoint = normalizedType === 'lost'
        ? `/api/admin/posts/lost?id=${id}`
        : `/api/admin/posts/found?id=${id}`;

      const response = await API.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete post" };
    }
  },
  fetchComments: async () => {
    try {
      const response = await API.get("/comment/getcomments");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Could not fetch comments" };
    }
  },
  approveComment: async (commentId, commentType) => {
    try {
      let endpoint = '';
      if (commentType === 'l') {
        endpoint = `/comment/verifylostcomment?id=${commentId}`;
      } else if (commentType === 'f') {
        endpoint = `/comment/verifyfoundcomment?id=${commentId}`;
      } else {
        throw new Error('Unknown comment type');
      }

      const response = await API.get(endpoint);
      return response.data; // or just return success message
    } catch (error) {
      throw error.response?.data || { message: 'Failed to verify comment' };
    }
  },
  rejectComment: async (commentId, commentType) => {
    try {
      const endpoint =
        commentType === 'l'
          ? `/comment/deleteadminlostcomment?id=${commentId}`
          : `/comment/deleteadminfoundcomment?id=${commentId}`;

      const response = await API.delete(endpoint);
      return response.data; // optional, just in case backend returns something
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete comment' };
    }
  },
  addCategory: async (categoryName) => {
    try {
      const response = await API.post("/api/categories", { category: categoryName });
      return response.data; // returns newly added category
    } catch (error) {
      throw error.response?.data || { message: "Failed to add category" };
    }
  },

  updateCategory: async (categoryId, categoryName) => {
    try {
      const response = await API.put(`/api/categories/${categoryId}`, { category: categoryName });
      return response.data; // returns updated category
    } catch (error) {
      throw error.response?.data || { message: "Failed to update category" };
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const response = await API.delete(`/api/categories/${categoryId}`);
      return response.data; // optional, may return deleted info
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete category" };
    }
  },
  approvePost: async (id, type) => {
    try {
      const endpoint = type === 'l'
        ? `/api/admin/posts/lost?id=${id}`
        : `/api/admin/posts/found?id=${id}`;

      const response = await API.put(endpoint);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Approval failed" };
    }
  },

  rejectPost: async (id, type) => {
    try {
      const endpoint = type === 'l'
        ? `/api/admin/posts/lost?id=${id}`
        : `/api/admin/posts/found?id=${id}`;

      const response = await API.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Rejection failed" };
    }
  }
  ,
  // Approve all pending posts (lost + found)
  approveAllPosts: async () => {
      try {
        const response = await API.put(`/api/admin/posts/approve-all`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Failed to approve all posts' };
      }
    },
  // Approve all pending comments (lost + found)
  approveAllComments: async () => {
      try {
        const response = await API.put(`/comment/admin/approve-all-comments`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: 'Failed to approve all comments' };
      }
    },

  // Fetch total user count
  fetchUserCount: async () => {
    try {
      const response = await API.get('/api/users/count');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user count' };
    }
  }

};
