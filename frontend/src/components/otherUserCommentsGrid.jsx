import { useState, useMemo } from "react";

export default function OtherUserCommentsGrid({ userComments }) {
  const [selectedComment, setSelectedComment] = useState(null);

  const openCommentDetail = (comment, group) => {
    setSelectedComment({ ...comment, postTitle: group.postTitle, postType: group.postType });
  };

  const closeCommentDetail = () => {
    setSelectedComment(null);
  };

 
  const groupedComments = useMemo(() => {
    if (!userComments || userComments.length === 0) return {};

    return userComments.reduce((groups, comment) => {
      const postTitle = comment.posttitle || comment.postTitle;
      const postType = comment.posttype || comment.postType;
      const isVerified = comment.isverified !== undefined ? comment.isverified : comment.isVerified;

     
      const groupKey = `${postTitle}_${postType}`;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          postTitle,
          postType,
          isVerified,
          comments: []
        };
      }

      groups[groupKey].comments.push(comment);
      return groups;
    }, {});
  }, [userComments]);

  if (!userComments || userComments.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-comment text-gray-400 text-xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Comments Yet</h3>
        <p className="text-gray-500 text-sm">This user hasn't made any comments yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedComments).map(([groupKey, group]) => (
        <div
          key={groupKey}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-4"
        >
          {/* Post Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${group.postType === "Lost"
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
                  }`}
              >
                <i className={`fas ${group.postType === "Lost" ? "fa-search" : "fa-hand-holding"} mr-1`}></i>
                {group.postType} Post
              </span>
            </div>
            <div className="text-xs text-gray-400 flex items-center">
              <i className="fas fa-comment mr-1"></i>
              {group.comments.length} comment{group.comments.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Post Reference */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Comments on:</p>
            <p className="font-medium text-gray-900">{group.postTitle}</p>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {group.comments.map((comment, index) => {
              const isUnverified = comment.isverified === false || comment.isVerified === false;
              
              return (
                <div
                  key={comment.id}
                  className={`${index !== group.comments.length - 1 ? 'border-b border-gray-100 pb-3' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`text-xs text-gray-500 ${isUnverified ? 'blur-sm select-none' : ''}`}>
                        {(() => {
                          const d = comment.rawDate || comment.date;
                          const utcDate = d ? new Date(d.replace(' ', 'T') + 'Z') : null;
                          return utcDate ? utcDate.toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : '';
                        })()}
                      </div>

                      {/* Comment Verification Status */}
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${isUnverified
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                          }`}
                      >
                        {isUnverified ? 'Unverified' : 'Verified'}
                      </span>
                    </div>
                  </div>
                  <div>
                    {isUnverified ? (
                      <p className="text-gray-400 italic text-sm">
                        This comment is pending verification
                      </p>
                    ) : (
                      <>
                        <p className="text-gray-700 break-words overflow-wrap-anywhere line-clamp-1">
                          {comment.comment}
                        </p>
                        {comment.comment && comment.comment.length > 50 && (
                          <button
                            onClick={() => openCommentDetail(comment, group)}
                            className="text-blue-600 text-sm font-medium mt-1 hover:underline"
                          >
                            Show more
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Comment Detail Modal */}
      {selectedComment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeCommentDetail}>
          <div 
            className="bg-white/95 backdrop-blur rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedComment.postType === "Lost"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                  }`}
                >
                  <i className={`fas ${selectedComment.postType === "Lost" ? "fa-search" : "fa-hand-holding"} mr-2`}></i>
                  {selectedComment.postType} Post
                </span>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">
                  Verified
                </span>
              </div>
              <button
                onClick={closeCommentDetail}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <i className="fas fa-times text-gray-500"></i>
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(80vh-80px)] scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* Post Reference */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Comment on:</p>
                <p className="font-medium text-gray-900">{selectedComment.postTitle}</p>
              </div>

              {/* Date */}
              <div className="flex items-center text-gray-500 text-sm">
                <i className="fas fa-calendar-alt mr-3 text-gray-400 w-5"></i>
                <span>
                  {(() => {
                    const d = selectedComment.rawDate || selectedComment.date;
                    const utcDate = d ? new Date(d.replace(' ', 'T') + 'Z') : null;
                    return utcDate ? utcDate.toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'No date';
                  })()}
                </span>
              </div>

              {/* Full Comment */}
              <div className="pt-3 border-t border-gray-100 pb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Comment</h3>
                <p className="text-gray-600 whitespace-pre-wrap break-words">{selectedComment.comment}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
