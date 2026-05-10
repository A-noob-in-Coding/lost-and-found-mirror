import API from "./api";
// Comment services
export const commentService = {
  getPostComments: async (postId) => {
    try {
      const response = await API.get(`/comment/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch comments' };
    }
  },

  addComment: async (postId, comment) => {
    try {
      const response = await API.post(`/comment/${postId}`, { comment });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add comment' };
    }
  },

  getUserComments: async (rollno) => {
    try {
      const response = await API.get(`/comment/user/rollno/${rollno}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user comments' };
    }
  },

  deleteComment: async (commentId, postType, rollno) => {
    try {
      const endpoint = postType === 'Lost' ? '/comment/deletelostcomment' : '/comment/deletefoundcomment';
      const payload = postType === 'Lost' 
        ? { l_comment_id: commentId, rollNo: rollno }
        : { f_comment_id: commentId, rollNo: rollno };
      
      const response = await API.delete(endpoint, { data: payload });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete comment' };
    }
  },

  deleteCommentByText: async (rollno, commentText, postType) => {
    try {
      const response = await API.delete('/comment/user/deletebytext', {
        data: {
          rollNo: rollno,
          comment: commentText,
          type: postType.toLowerCase()
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete comment' };
    }
  }
};


