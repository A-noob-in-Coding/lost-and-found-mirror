import CommentModel from '../model/CommentModel.js';
import UserModel from '../model/UserModel.js';

export const addFoundCommentService = async (rollNo, fPostID, comment) => {
  // Check if user is verified - auto-approve their comments
  const isVerified = await UserModel.isUserVerified(rollNo);
  await CommentModel.addFoundComment(rollNo, fPostID, comment, isVerified);
  return { autoApproved: isVerified };
}

export const addLostCommentService = async (rollNo, lPostID, comment) => {
  // Check if user is verified - auto-approve their comments
  const isVerified = await UserModel.isUserVerified(rollNo);
  await CommentModel.addLostComment(rollNo, lPostID, comment, isVerified);
  return { autoApproved: isVerified };
}

export const deleteLostCommentService = async (rollNo, lcommentID) => {
  await CommentModel.deleteLostComment(rollNo, lcommentID);
}

export const deleteFoundCommentService = async (rollNo, fcommentID) => {
  await CommentModel.deleteFoundComment(rollNo, fcommentID);
}

export const getAllFoundCommentsService = async (flag) => {
  return await CommentModel.getAllFoundComments(!!flag);
}

export const getAllLostCommentsService = async (flag) => {
  return await CommentModel.getAllLostComments(!!flag);
}

export const verifyLostCommentService = async (lcommentID) => {
  await CommentModel.verifyLostComment(lcommentID);
}

export const verifyFoundCommentService = async (fcommentID) => {
  await CommentModel.verifyFoundComment(fcommentID);
}

export const approveAllCommentsService = async () => {
  const res = await CommentModel.approveAllComments();
  return {
    lostUpdated: res.lost,
    foundUpdated: res.found,
  };
};

export const getAdminAllCommentsService = async () => {
  return await CommentModel.getAdminAllComments();
}

export const deleteAdminLostCommentService = async (lcommentID) => {
  await CommentModel.deleteAdminLostComment(lcommentID);
}

export const deleteAdminFoundCommentService = async (fcommentID) => {
  await CommentModel.deleteAdminFoundComment(fcommentID);
}

export const deleteUserCommentByTextService = async (rollNo, commentText, type) => {
  const success = await CommentModel.deleteUserCommentByText(rollNo, commentText, type);
  if (!success) {
    throw new Error('Comment not found');
  }
};

export const getUserCommentsService = async (rollno) => {
  return await CommentModel.getUserComments(rollno);
};