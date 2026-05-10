import API from "./api";
// Post services

export const postService = {
  getAllPosts: async () => {
    try {
      const response = await API.get('/api/user/posts/getPostData');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch posts' };
    }
  },

  getRecent6Posts: async () => {
    try {
      const response = await API.get('/api/user/posts/recent6');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch recent posts' };
    }
  },

  getStatistics: async () => {
    try {
      const response = await API.get('/api/user/posts/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch statistics' };
    }
  },

  createPost: async (formData, postType) => {
    try {
      const response = await API.post(`/api/user/posts/${postType}`, formData);
      return response.data
    } catch (error) {
      throw error.response?.data || { message: `Failed to create ${postType} post` };
    }
  },

  getUserPosts: async (rollno) => {
    try {
      const response = await API.get(`/api/user/posts/rollno/${rollno}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user posts' };
    }
  },

  deletePost: async (postId, postType) => {
    try {
      const response = await API.delete(`/api/user/posts/${postType.toLowerCase()}/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: `Failed to delete ${postType} post` };
    }
  }
};

