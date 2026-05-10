import { useState, useMemo, useEffect, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import PostVerificationContainer from '../components/postVerificationContainer.jsx';
import CommentVerificationContainer from '../components/commentVerificationContainer.jsx';
import CategoryContainer from '../components/catagorySection.jsx';
import AdminFooter from '../utilities/adminFooter.jsx';
import toast from 'react-hot-toast';
import {
  useAdminPosts,
  useAdminAllPosts,
  useAdminComments,
  useAdminLogin,
  useApprovePost,
  useRejectPost,
  useDeletePost,
  useApproveComment,
  useRejectComment,
  useApproveAllPosts,
  useApproveAllComments,
  useAddCategory,
  useUpdateCategory,
  useDeleteCategory,
  useAdminUserCount
} from '../hooks/adminHook.js';
import { useCategories, useCampuses } from '../hooks/utilHook.js';
import { adminService } from '../services/adminService.js';

const AdminPage = () => {
  // Check for existing admin token on mount
  const [authenticated, setAuthenticated] = useState(() => {
    return !!localStorage.getItem('adminToken');
  });
  const [activeTab, setActiveTab] = useState('posts');
  const [processingId, setProcessingId] = useState(null);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const captchaRef = useRef(null);

  // Filter states for All Posts tab
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [campusFilter, setCampusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State for details panel
  const [selectedPost, setSelectedPost] = useState(null);
  
  // State for tracking which post is being deleted
  const [deletingPostId, setDeletingPostId] = useState(null);

  // Handle logout
  const handleLogout = () => {
    adminService.logoutAdmin();
    setAuthenticated(false);
    setLoginData({ username: '', password: '' });
  };

  // QUERIES 
  const {
    data: posts = [],
    isLoading: postsLoading,
    refetch: refetchPosts
  } = useAdminPosts({ enabled: authenticated });

  const {
    data: allPosts = [],
    isLoading: allPostsLoading,
    refetch: refetchAllPosts
  } = useAdminAllPosts({ enabled: authenticated });

  const {
    data: comments = [],
    isLoading: commentsLoading,
    refetch: refetchComments
  } = useAdminComments({ enabled: authenticated });

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    refetch: refetchCategories
  } = useCategories({ enabled: authenticated });

  const {
    data: campuses = [],
  } = useCampuses({ enabled: authenticated });

  // User count with memoization to reduce API calls
  const {
    data: userCount = 0,
    isLoading: userCountLoading,
  } = useAdminUserCount({ enabled: authenticated });

  // Memoize user count to prevent unnecessary re-renders
  const memoizedUserCount = useMemo(() => userCount, [userCount]);

  // MUTATIONS 
  const loginMutation = useAdminLogin({
    onSuccess: () => {
      setAuthenticated(true);
      setLoginError('');
    },
    onError: (error) => {
      setLoginError(error?.message || "Invalid credentials");
      // Reset captcha on error
      setCaptchaToken('');
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha();
      }
    }
  });

  const approvePostMutation = useApprovePost({
    onSuccess: () => {
      toast.success('Post approved successfully');
      refetchPosts();
      refetchAllPosts();
    },
    onError: (error) => {
      toast.error('Approval failed');
    }
  });

  const rejectPostMutation = useRejectPost({
    onSuccess: () => {
      toast.success('Post rejected successfully');
      refetchPosts();
      refetchAllPosts();
    },
    onError: (error) => {
      toast.error('Rejection failed');
    }
  });

  const deletePostMutation = useDeletePost({
    onSuccess: () => {
      toast.success('Post deleted successfully');
      setDeletingPostId(null);
      refetchPosts();
      refetchAllPosts();
    },
    onError: (error) => {
      toast.error('Failed to delete post');
      setDeletingPostId(null);
    }
  });

  const approveCommentMutation = useApproveComment({
    onSuccess: () => {
      toast.success('Comment approved successfully');
      refetchComments();
    },
    onError: (error) => {
      toast.error('Failed to approve comment');
    }
  });

  const rejectCommentMutation = useRejectComment({
    onSuccess: () => {
      toast.success('Comment rejected successfully');
      refetchComments();
    },
    onError: (error) => {
      toast.error('Failed to reject comment');
    }
  });

  const addCategoryMutation = useAddCategory({
    onSuccess: () => {
      toast.success('Category added successfully');
      refetchCategories();
    },
    onError: (error) => {
      toast.error('Failed to add category');
    }
  });

  const updateCategoryMutation = useUpdateCategory({
    onSuccess: (_, variables) => {
      toast.success(`Category updated to "${variables.categoryName}"`);
      refetchCategories();
    },
    onError: (error) => {
      toast.error('Failed to update category');
    }
  });

  const deleteCategoryMutation = useDeleteCategory({
    onSuccess: () => {
      toast.success('Category deleted');
      refetchCategories();
    },
    onError: (error) => {
      toast.error('Failed to delete category');
    }
  });

  // Bulk approve mutations
  const approveAllPostsMutation = useApproveAllPosts({
    onSuccess: (data) => {
      toast.success('All pending posts approved successfully');
      refetchPosts();
      refetchAllPosts();
    },
    onError: (error) => {
      toast.error('Failed to approve all posts');
    }
  });

  const approveAllCommentsMutation = useApproveAllComments({
    onSuccess: (data) => {
      toast.success('All pending comments approved successfully');
      refetchComments();
    },
    onError: (error) => {
      toast.error('Failed to approve all comments');
    }
  });

  //  HANDLERS 
  const handleRefresh = async () => {
    switch (activeTab) {
      case 'posts':
        await refetchPosts();
        toast.success('Posts refreshed');
        break;
      case 'allposts':
        await refetchAllPosts();
        toast.success('All posts refreshed');
        break;
      case 'comments':
        await refetchComments();
        toast.success('Comments refreshed');
        break;
      case 'categories':
        await refetchCategories();
        toast.success('Categories refreshed');
        break;
      default:
        break;
    }
  };

  const handleDeletePost = async (id, type) => {
    setDeletingPostId(`${type}-${id}`);
    deletePostMutation.mutate({ id, type });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      setLoginError('Please enter both username and password');
      return;
    }
    if (!captchaToken) {
      setLoginError('Please complete the captcha verification');
      return;
    }
    loginMutation.mutate({
      username: loginData.username,
      password: loginData.password,
      captchaToken: captchaToken
    });
  };

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    if (loginError) {
      setLoginError('');
    }
  };

  const handlePostApprove = async (id, type) => {
    approvePostMutation.mutate({ id, type });
  };

  const handlePostReject = async (id, type) => {
    rejectPostMutation.mutate({ id, type });
  };

  const handleCommentApprove = async (commentId, commentType) => {
    approveCommentMutation.mutate({ commentId, commentType });
  };

  const handleCommentReject = async (commentId, commentType) => {
    rejectCommentMutation.mutate({ commentId, commentType });
  };

  const handleAddCategory = async (categoryName) => {
    setProcessingId('add_category');
    try {
      await addCategoryMutation.mutate(categoryName);
      return { success: true, message: `Category "${categoryName}" added successfully` };
    } catch (error) {
      return { success: false, message: 'Failed to add category' };
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateCategory = async (categoryId, categoryName) => {
    setProcessingId(`update_category_${categoryId}`);
    try {
      await updateCategoryMutation.mutate({ categoryId, categoryName });
      return { success: true, message: `Category updated to "${categoryName}"` };
    } catch (error) {
      return { success: false, message: 'Failed to update category' };
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    setProcessingId(`delete_category_${categoryId}`);
    const categoryToDelete = categories.find(cat => cat.category_id === categoryId);
    try {
      await deleteCategoryMutation.mutate(categoryId);
      return { success: true, message: `Category "${categoryToDelete?.category}" deleted` };
    } catch (error) {
      return { success: false, message: 'Failed to delete category' };
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveAllPosts = () => {
    if (pendingPosts.length === 0) {
      toast('No pending posts to approve');
      return;
    }
    approveAllPostsMutation.mutate();
  };

  const handleApproveAllComments = () => {
    if (pendingComments.length === 0) {
      toast('No pending comments to approve');
      return;
    }
    approveAllCommentsMutation.mutate();
  };

  //   MEMOIZED DATA 
  const postsWithStatus = useMemo(() => {
    return posts.map((post) => ({
      ...post,
      status: "pending",
    }));
  }, [posts]);

  const commentsWithStatus = useMemo(() => {
    return comments.map((comment) => ({
      ...comment,
      status: "pending",
    }));
  }, [comments]);

  const pendingComments = useMemo(() => {
    return commentsWithStatus.filter(comment => comment.status === 'pending');
  }, [commentsWithStatus]);

  const pendingPosts = useMemo(() => {
    return postsWithStatus.filter(post => post.status === 'pending');
  }, [postsWithStatus]);

  // Filtered all posts for admin
  const filteredAllPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesType = typeFilter === 'all' || post.type?.toLowerCase() === typeFilter.toLowerCase();
      const matchesSearch = !searchQuery || 
        post.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCampus = campusFilter === 'all' || post.campus === campusFilter;
      const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'verified' && post.is_verified) ||
        (statusFilter === 'pending' && !post.is_verified);
      
      return matchesType && matchesSearch && matchesCampus && matchesCategory && matchesStatus;
    });
  }, [allPosts, typeFilter, searchQuery, campusFilter, categoryFilter, statusFilter]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/lf_logo.png"
                alt="Lost & Found Logo"
                className="h-16 w-16 rounded-full shadow-lg"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
            <p className="text-sm text-gray-600">Access the admin dashboard</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Enter username"
                disabled={loginMutation.isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Enter password"
                  disabled={loginMutation.isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <HCaptcha
                sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken('')}
                ref={captchaRef}
              />
            </div>
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {loginError}
              </div>
            )}
            <button
              type="submit"
              disabled={loginMutation.isLoading}
              className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
            >
              {loginMutation.isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo and Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img
              src="/lf_logo.png"
              alt="Lost & Found Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
            />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">FAST Lost & Found</h1>
          </div>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="ml-auto flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-all duration-300"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span className="hidden sm:inline text-sm font-medium">Logout</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-3 sm:mb-4">
            Admin Dashboard
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto px-4">
            Manage posts, comments, and categories for the FAST NUCES Lost & Found platform
          </p>
        </div>
      </section>

      {/* Navigation Tabs Section */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6 sm:mb-8">
            {/* Desktop Tab Layout */}
            <div className="hidden sm:flex bg-gray-100 rounded-2xl p-2 space-x-2">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex items-center px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'posts'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
              >
                <i className="fas fa-clipboard-list mr-2"></i>
                Pending Posts
              </button>
              <button
                onClick={() => setActiveTab('allposts')}
                className={`flex items-center px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'allposts'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
              >
                <i className="fas fa-th-list mr-2"></i>
                All Posts
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`flex items-center px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'comments'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
              >
                <i className="fas fa-comments mr-2"></i>
                Comments
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'categories'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
              >
                <i className="fas fa-tags mr-2"></i>
                Categories
              </button>
            </div>

            {/* Mobile Tab Layout */}
            <div className="sm:hidden w-full">
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`flex flex-col items-center px-2 py-3 rounded-xl font-medium transition-all duration-300 text-xs ${activeTab === 'posts'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200'
                    }`}
                >
                  <i className="fas fa-clipboard-list mb-1 text-sm"></i>
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab('allposts')}
                  className={`flex flex-col items-center px-2 py-3 rounded-xl font-medium transition-all duration-300 text-xs ${activeTab === 'allposts'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200'
                    }`}
                >
                  <i className="fas fa-th-list mb-1 text-sm"></i>
                  All
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex flex-col items-center px-2 py-3 rounded-xl font-medium transition-all duration-300 text-xs ${activeTab === 'comments'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200'
                    }`}
                >
                  <i className="fas fa-comments mb-1 text-sm"></i>
                  Comments
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`flex flex-col items-center px-2 py-3 rounded-xl font-medium transition-all duration-300 text-xs ${activeTab === 'categories'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200'
                    }`}
                >
                  <i className="fas fa-tags mb-1 text-sm"></i>
                  Categories
                </button>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={postsLoading || commentsLoading || categoriesLoading || allPostsLoading}
                className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className={`fas fa-sync-alt ${(postsLoading || commentsLoading || categoriesLoading || allPostsLoading) ? 'fa-spin' : ''}`}></i>
                <span className="text-sm font-medium">
                  {(postsLoading || commentsLoading || categoriesLoading) ? 'Refreshing...' : 'Refresh'}
                </span>
              </button>

              {/* Approve buttons moved into respective sections (posts/comments) per UX request */}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
            {activeTab === 'posts' && (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleApproveAllPosts}
                    disabled={approveAllPostsMutation.isLoading}
                    className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className={`fas fa-check ${approveAllPostsMutation.isLoading ? 'fa-spin' : ''}`}></i>
                    <span className="text-sm font-medium">Approve All Posts</span>
                  </button>
                </div>
                <PostVerificationContainer
                  posts={pendingPosts}
                  loading={postsLoading}
                  onApprove={handlePostApprove}
                  onReject={handlePostReject}
                />
              </>)}

            {activeTab === 'comments' && (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleApproveAllComments}
                    disabled={approveAllCommentsMutation.isLoading}
                    className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className={`fas fa-check ${approveAllCommentsMutation.isLoading ? 'fa-spin' : ''}`}></i>
                    <span className="text-sm font-medium">Approve All Comments</span>
                  </button>
                </div>
                <CommentVerificationContainer
                  comments={pendingComments}
                  loading={commentsLoading}
                  onApprove={handleCommentApprove}
                  onReject={handleCommentReject}
                />
              </>
            )}

            {activeTab === 'categories' && (
              <CategoryContainer
                categories={categories}
                loading={categoriesLoading}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                processingId={processingId}
              />
            )}

            {activeTab === 'allposts' && (
              <div>
                {/* Filters Section */}
                <div className="mb-6 space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all duration-300"
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>

                  {/* Filter Dropdowns */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Type Filter */}
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="lost">Lost</option>
                      <option value="found">Found</option>
                    </select>

                    {/* Campus Filter */}
                    <select
                      value={campusFilter}
                      onChange={(e) => setCampusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 text-sm"
                    >
                      <option value="all">All Campuses</option>
                      {campuses?.map((campus) => (
                        <option key={campus.campusID} value={campus.campusName}>{campus.campusName}</option>
                      ))}
                    </select>

                    {/* Category Filter */}
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 text-sm"
                    >
                      <option value="all">All Categories</option>
                      {categories?.map((category) => (
                        <option key={category.category_id} value={category.category}>{category.category}</option>
                      ))}
                    </select>

                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all duration-300 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Posts Count */}
                <div className="mb-4 text-sm text-gray-600">
                  Showing {filteredAllPosts.length} posts
                </div>

                {/* Loading State */}
                {allPostsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <i className="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
                  </div>
                ) : filteredAllPosts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-th-large text-gray-400 text-xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Posts Found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your filters to see more posts.</p>
                  </div>
                ) : (
                  /* Posts Grid */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAllPosts.map((post) => (
                      <div 
                        key={`${post.type}-${post.id}`} 
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
                      >
                        {/* Post Image - Square aspect ratio */}
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={post.image_url || '/no_prev_img.png'}
                            alt={post.item_name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Post Content */}
                        <div className="p-4">
                          {/* Badges */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                <i className={`fas ${post.type === 'lost' ? 'fa-search' : 'fa-hand-holding'} mr-1`}></i>
                                {post.type === 'lost' ? 'Lost' : 'Found'}
                              </span>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded ${post.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {post.is_verified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                            {/* Delete Icon Button */}
                            <button
                              onClick={() => handleDeletePost(post.id, post.type)}
                              disabled={deletingPostId === `${post.type}-${post.id}`}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete post"
                            >
                              <i className={`fas ${deletingPostId === `${post.type}-${post.id}` ? 'fa-spinner fa-spin' : 'fa-trash'} text-sm`}></i>
                            </button>
                          </div>

                          {/* Title */}
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{post.item_name || 'Untitled'}</h3>

                          {/* Location and Category */}
                          <div className="space-y-1 mb-3">
                            <div className="flex items-center text-gray-600 text-sm">
                              <i className="fas fa-tag mr-2 text-gray-400"></i>
                              <span className="truncate">{post.category || 'No Category'}</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                              <i className="fas fa-university mr-2 text-gray-400"></i>
                              <span className="truncate">{post.campus || 'No Campus'}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="mb-3 overflow-hidden">
                            <p className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                              {post.description || 'No description'}
                            </p>
                            {post.description && post.description.length > 40 && (
                              <button
                                onClick={() => setSelectedPost(post)}
                                className="text-blue-600 text-xs font-medium mt-1 hover:underline"
                              >
                                Show more
                              </button>
                            )}
                          </div>

                          {/* Date and Author */}
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'No date'}</span>
                            <span className="truncate ml-2">by {post.username || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Admin Statistics Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-black">Platform Overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">
                {userCountLoading ? <i className="fas fa-spinner fa-spin text-2xl"></i> : (memoizedUserCount ?? 0)}
              </div>
              <div className="text-gray-300 text-xs sm:text-sm">Total Users</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">{pendingPosts.length}</div>
              <div className="text-gray-300 text-xs sm:text-sm">Pending Posts</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">{pendingComments.length}</div>
              <div className="text-gray-300 text-xs sm:text-sm">Pending Comments</div>
            </div>
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8 text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">{categories.length}</div>
              <div className="text-gray-300 text-xs sm:text-sm">Total Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Keep the Platform Safe</h3>
          <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg px-4">
            Your moderation helps maintain a trustworthy environment for all FAST NUCES students.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveTab('posts')}
              className="bg-white text-black px-6 sm:px-8 py-3 rounded-full text-sm sm:font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform"
            >
              Review Posts
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-full text-sm sm:font-medium hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 transform"
            >
              Review Comments
            </button>
          </div>
        </div>
      </section>

      <AdminFooter />

      {/* Post Details Panel */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPost(null)}>
          <div 
            className="bg-white/95 backdrop-blur rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
              {/* Left - Image */}
              <div className="md:w-1/2 bg-gray-100 flex-shrink-0">
                <img
                  src={selectedPost.image_url || '/no_prev_img.png'}
                  alt={selectedPost.item_name}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>

              {/* Right - Content */}
              <div className="md:w-1/2 flex flex-col max-h-[85vh] md:max-h-full">
                {/* Header with close button */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedPost.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      <i className={`fas ${selectedPost.type === 'lost' ? 'fa-search' : 'fa-hand-holding'} mr-2`}></i>
                      {selectedPost.type === 'lost' ? 'Lost' : 'Found'}
                    </span>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${selectedPost.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {selectedPost.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <i className="fas fa-times text-gray-500"></i>
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900">{selectedPost.item_name || 'Untitled'}</h2>

                  {/* Location, Category and Campus */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-tag mr-3 text-gray-400 w-5"></i>
                      <span>{selectedPost.category || 'No Category'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-university mr-3 text-gray-400 w-5"></i>
                      <span>{selectedPost.campus || 'No Campus'}</span>
                    </div>
                    {selectedPost.location && (
                      <div className="flex items-center text-gray-600">
                        <i className="fas fa-map-marker-alt mr-3 text-gray-400 w-5"></i>
                        <span>{selectedPost.location}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-500 text-sm">
                      <i className="fas fa-calendar-alt mr-3 text-gray-400 w-5"></i>
                      <span>
                        {selectedPost.created_at ? new Date(selectedPost.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'No date'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <i className="fas fa-user mr-3 text-gray-400 w-5"></i>
                      <span>by {selectedPost.username || 'Unknown'}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="pt-3 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600 whitespace-pre-wrap break-words">{selectedPost.description || 'No description'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

