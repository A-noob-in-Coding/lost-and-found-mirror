import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

//QUERIES

// Fetch Posts
export const useAdminPosts = (options = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { enabled = true } = options;

  const fetchData = async () => {
    if (!enabled) return;
    setIsLoading(true);
    try {
      const res = await adminService.fetchPosts();
      setData(res);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled]);

  return { data, isLoading, error, refetch: fetchData };
};

// Fetch All Posts (both verified and unverified)
export const useAdminAllPosts = (options = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { enabled = true } = options;

  const fetchData = async () => {
    if (!enabled) return;
    setIsLoading(true);
    try {
      const res = await adminService.fetchAllPosts();
      setData(res);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled]);

  return { data, isLoading, error, refetch: fetchData };
};

// Fetch Comments
export const useAdminComments = (options = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { enabled = true } = options;

  const fetchData = async () => {
    if (!enabled) return;
    setIsLoading(true);
    try {
      const res = await adminService.fetchComments();
      setData(res);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled]);

  return { data, isLoading, error, refetch: fetchData };
};

// Fetch User Count with memoization
export const useAdminUserCount = (options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { enabled = true } = options;

  const fetchData = async () => {
    if (!enabled) return;
    setIsLoading(true);
    try {
      const res = await adminService.fetchUserCount();
      setData(res.count);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled]);

  return { data, isLoading, error, refetch: fetchData };
};

//MUTATIONS

// Login Admin
export const useAdminLogin = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ username, password, captchaToken }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.loginAdmin(username, password, captchaToken);
      if (options.onSuccess) {
        options.onSuccess(result, { username, password });
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

// Delete Post (for admin all posts view)
export const useDeletePost = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ id, type }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.deletePost(id, type);
      if (options.onSuccess) {
        options.onSuccess(result, { id, type });
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

// Approve Post
export const useApprovePost = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ id, type }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.approvePost(id, type);
      if (options.onSuccess) {
        options.onSuccess(result, { id, type });
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

// Reject Post
export const useRejectPost = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ id, type }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.rejectPost(id, type);
      if (options.onSuccess) {
        options.onSuccess(result, { id, type });
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

export const useApproveComment = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ commentId, commentType }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.approveComment(commentId, commentType);
      if (options.onSuccess) {
        options.onSuccess(result, { commentId, commentType });
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

// Reject Comment
export const useRejectComment = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ commentId, commentType }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.rejectComment(commentId, commentType);
      if (options.onSuccess) {
        options.onSuccess(result, { commentId, commentType });
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

// Add Category
export const useAddCategory = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (categoryName) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.addCategory(categoryName);
      if (options.onSuccess) {
        options.onSuccess(result, categoryName);
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

// Update Category
export const useUpdateCategory = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ categoryId, categoryName }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.updateCategory(categoryId, categoryName);
      if (options.onSuccess) {
        options.onSuccess(result, { categoryId, categoryName });
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

// Delete Category
export const useDeleteCategory = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (categoryId) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.deleteCategory(categoryId);
      if (options.onSuccess) {
        options.onSuccess(result, categoryId);
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

// Approve All Posts 
export const useApproveAllPosts = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.approveAllPosts();
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

// Approve All Comments 
export const useApproveAllComments = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.approveAllComments();
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
