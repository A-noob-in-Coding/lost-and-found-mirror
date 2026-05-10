import { useState, useEffect } from 'react';
import { commentService } from '../services/commentService';
import { useAuth } from '../context/authContext';

//QUERIES

// Get Post Comments
export const usePostComments = (postId, options = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) {
      setIsLoading(false);
      return;
    }
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await commentService.getPostComments(postId);
        if (mounted) {
          setData(res);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [postId]);

  return { data, isLoading, error };
};

// Get User Comments
export const useUserComments = (rollno, options = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!rollno) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await commentService.getUserComments(rollno);
      setData(res);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!rollno) {
      setIsLoading(false);
      return;
    }
    let mounted = true;
    const loadData = async () => {
      try {
        const res = await commentService.getUserComments(rollno);
        if (mounted) {
          setData(res);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [rollno]);

  const removeComment = (commentId) => {
    setData(prevData => prevData.filter(comment => comment.id !== commentId));
  };

  return { data, isLoading, error, refetch: fetchData, removeComment };
};

// MUTATIONS
// Add Comment
export const useAddComment = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ postId, comment }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await commentService.addComment(postId, comment);
      if (options.onSuccess) {
        options.onSuccess(result, { postId, comment });
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

// Delete Comment by ID
export const useDeleteComment = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async ({ commentId, postType, rollno, postId }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await commentService.deleteComment(commentId, postType, rollno);
      if (options.onSuccess) {
        options.onSuccess(result, { commentId, postType, rollno, postId });
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: mutateAsync, mutateAsync, isLoading, error };
};

// Delete Comment by Text
export const useDeleteCommentByText = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ rollno, commentText, postType, postId }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await commentService.deleteCommentByText(rollno, commentText, postType);
      if (options.onSuccess) {
        options.onSuccess(result, { rollno, commentText, postType, postId });
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};
