import CommentsVerificationForm from './commentsVerificationForm.jsx';

const CommentVerificationContainer = ({ comments, loading, onApprove, onReject }) => {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Comments Verification</h2>
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading comments...</div>
      ) : comments.length > 0 ? (
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 md:gap-4">
          {comments.map(comment => (
            <CommentsVerificationForm
              key={comment.comment_id}
              comment={comment}
              onApprove={() => onApprove(comment.comment_id, comment.comment_type)}
              onReject={() => onReject(comment.comment_id, comment.comment_type)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No pending comments to verify
        </div>
      )}
    </section>
  );
};

export default CommentVerificationContainer;
