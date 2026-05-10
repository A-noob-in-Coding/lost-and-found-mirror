const CommentsVerificationForm = ({ comment, onApprove, onReject }) => {
  return (
    <div className="p-4 rounded-lg bg-gray-50 hover:shadow-sm transition-shadow duration-300 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className="text-sm text-gray-700 mb-1 break-words overflow-wrap-anywhere">{comment.comment}</p>
        </div>
        <div className="flex gap-3 self-end md:self-auto">
          <button 
            onClick={() => onApprove(comment.comment_id)}
            className="!rounded-button whitespace-nowrap bg-black text-white px-3 mr-2 py-1.5 text-sm font-medium flex items-center cursor-pointer"
          >
            <i className="fas fa-check mr-2"></i>
            Approve
          </button>
          <button 
            onClick={() => onReject(comment.comment_id)}
            className="!rounded-button whitespace-nowrap bg-black text-white ml-2 px-6 py-1.5 text-sm font-medium flex items-center cursor-pointer"
          >
            <i className="fas fa-times mr-2"></i>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsVerificationForm;