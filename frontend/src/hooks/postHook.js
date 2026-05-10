import { useState, useEffect, useCallback } from 'react';
import { postService } from '../services/postService';
import { useAuth } from '../context/authContext';

// QUERIES
// Get All Posts
export const useAllPosts = (options = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      const res = await postService.getAllPosts();
      setData(res);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
};

// Get Recent 6 Posts
export const useRecent6Posts = (options = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await postService.getRecent6Posts();
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
  }, []);

  return { data, isLoading, error };
};

// Get Statistics
export const useStatistics = (options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await postService.getStatistics();
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
  }, []);

  return { data, isLoading, error };
};

// Get User Posts
export const useUserPosts = (rollno, options = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!rollno) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await postService.getUserPosts(rollno);
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
      setIsLoading(true);
      try {
        const res = await postService.getUserPosts(rollno);
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

  const removePost = (postId) => {
    setData(prevData => prevData.filter(post => post.id !== postId));
  };

  return { data, isLoading, error, refetch: fetchData, removePost };
};

// MUTATIONS
// Create Post
export const useCreatePost = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ formData, postType }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await postService.createPost(formData, postType);
      if (options.onSuccess) {
        options.onSuccess(result);
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

// Delete Post
export const useDeletePost = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async ({ postId, postType, rollno }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await postService.deletePost(postId, postType);
      if (options.onSuccess) {
        options.onSuccess(result, { postId, postType, rollno });
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

// Update Post
export const useUpdatePost = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ postId, updateData, postType }) => {
    setIsLoading(true);
    setError(null);
    try {
      // Note: Service implementation was missing in original file too
      throw new Error('Update post not implemented in service');
    } catch (err) {
      setError(err);
      if (options.onError) options.onError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

export const usePrefetchUserPosts = () => {
  return (rollno) => { };
};
