import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { authService } from '../services/authService';
import { useUtil } from '../context/utilContext';
import toast from 'react-hot-toast';
import Footer from '../utilities/footer';
import OtherUserPostsGrid from '../components/otherUserPostsGrid';
import OtherUserCommentsGrid from '../components/otherUserCommentsGrid';
import OtherProfileSkeleton from '../components/otherProfileSkeleton';
import { ClipLoader } from 'react-spinners';
import { decryptRollno, encryptRollno } from '../utilities/methods';

export default function OtherProfileView() {
  const { er } = useParams()
  const navigate = useNavigate();
  const { isUserVerified } = useUtil();
  let rollno = ""
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [postsLoading, setPostsLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const load = async () => {
      try {
        rollno = decryptRollno(er)
        const userDetails = await authService.getUserDetails(rollno, 1);
        if (!userDetails) {
          setUser(null);
          return;
        }

        setUser(userDetails);

        const privateFlag =
          String(userDetails.account_type || '').toLowerCase() === 'private' ||
          userDetails.isPrivate === true ||
          userDetails.private === true;

        setIsPrivate(privateFlag);

        if (!privateFlag) {
          setPostsLoading(true);
          const userPosts = await postService.getUserPosts(rollno);
          setPosts(userPosts || []);
          setPostsLoading(false);

          setCommentsLoading(true);
          const userComments = await commentService.getUserComments(rollno);
          if (userComments) {
            userComments.sort((a, b) => new Date(b.rawDate || b.date) - new Date(a.rawDate || a.date));
            setComments(userComments || []);
          }
          setCommentsLoading(false);
        }
      } catch (error) {
        toast.error('Failed to load profile data', error);
      } finally {
        setLoading(false);
      }
    };

    load();

  }, [er]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
          <OtherProfileSkeleton cards={6} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold">Profile not found</h2>
            <p className="text-gray-500 mt-2">The profile you requested could not be found.</p>
            <div className="mt-4">
              <button
                onClick={() => navigate('/feed')}
                className="px-4 py-2 bg-white text-black border-2 border-black rounded-full transform transition-all duration-200 hover:scale-105 hover:bg-black hover:text-white"
              >
                Back to feed
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/lf_logo.png" alt="logo" className="w-10 h-10 rounded-full" />
            <h1 className="text-xl font-bold">Lost and Found</h1>
          </div>
          <div className="hidden md:block">
            <button
              onClick={() => navigate('/feed')}
              className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black border-2 border-black transition-all duration-300 hover:scale-110 transform"
            >
              Back to Feed
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 transition-all"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-2">
            <button
              onClick={() => {
                navigate('/feed');
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i className="fas fa-home mr-3"></i>
              Back to Feed
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                {user.image_url ? (
                  <img src={user.image_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <i className="fas fa-user text-gray-400 text-2xl"></i>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-black">{user.name}</h2>
                      {isUserVerified(user.rollno) && (
                        <img src="/verfication_tag.png" alt="Verified" title="Verified User" className="w-5 h-5 object-contain" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{user.campusName || user.campus || user.campus_id || ''}</div>
                    {!isPrivate && (
                      <div className="text-sm text-gray-600">Roll Number: {user.rollno || user.rollNumber || ''}</div>
                    )}
                  </div>
                </div>

                {!isPrivate && (
                  <div className="mt-4 flex items-center space-x-6 text-sm text-gray-700">
                    <div>
                      <span className="block text-lg font-semibold text-black">{posts.length}</span>
                      <span className="text-gray-500">posts</span>
                    </div>
                    <div>
                      <span className="block text-lg font-semibold text-black">{comments.length}</span>
                      <span className="text-gray-500">comments</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === 'posts' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
            >
              <i className="fas fa-th-large mr-2"></i>
              Posts
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === 'comments' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
            >
              <i className="fas fa-comments mr-2"></i>
              Comments
            </button>
          </div>
        </div>

        {/* Content */}
        {isPrivate ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-lg">This profile is private</h3>
            <p className="text-sm text-gray-600 mt-2">The user has set their profile to private. You cannot view posts or comments.</p>
          </div>
        ) : (
          <>
            {activeTab === 'posts' ? (
              postsLoading ? (
                <div className="py-4">
                  <OtherProfileSkeleton cards={6} />
                </div>
              ) : (
                <OtherUserPostsGrid userPosts={posts} />
              )
            ) : (
              commentsLoading ? (
                <div className="flex justify-center items-center py-16">
                  <ClipLoader color="#000000" loading={true} size={40} />
                </div>
              ) : (
                <OtherUserCommentsGrid userComments={comments} />
              )
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
