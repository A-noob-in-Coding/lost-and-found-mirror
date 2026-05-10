import express from "express"
import { addFoundComment, addLostComment, deleteFoundComment, deleteLostComment, getUserAllFoundComments, getUserAllLostComments, getAdminAllFoundComments, getAdminAllLostComments, verifyFoundComment, verifyLostComment, getAdminAllComments, deleteAdminFoundComment, deleteAdminLostComment, deleteUserCommentByText, getUserComments, adminApproveAllComments } from "../controllers/commentController.js"
import { requireAuth } from "../middleware/auth.js"
const commentRoutes = express.Router()

commentRoutes.post('/addlostcomment', requireAuth, addLostComment)
commentRoutes.post('/addfoundcomment', requireAuth, addFoundComment)
commentRoutes.get('/verifylostcomment', requireAuth, verifyLostComment)
commentRoutes.get('/verifyfoundcomment', requireAuth, verifyFoundComment)
commentRoutes.delete('/deletelostcomment', requireAuth, deleteLostComment)
commentRoutes.delete('/deletefoundcomment', requireAuth, deleteFoundComment)
commentRoutes.delete('/deleteadminlostcomment', requireAuth, deleteAdminLostComment)
commentRoutes.delete('/deleteadminfoundcomment', requireAuth, deleteAdminFoundComment)
commentRoutes.get('/user/foundcomments', requireAuth, getUserAllFoundComments)
commentRoutes.get('/user/lostcomments', requireAuth, getUserAllLostComments)
commentRoutes.get('/admin/foundcomments', requireAuth, getAdminAllFoundComments)
commentRoutes.get('/admin/lostcomments', requireAuth, getAdminAllLostComments)
commentRoutes.get('/getcomments', requireAuth, getAdminAllComments)
commentRoutes.put('/admin/approve-all-comments', requireAuth, adminApproveAllComments)
commentRoutes.delete('/user/deletebytext', requireAuth, deleteUserCommentByText);
commentRoutes.get('/user/rollno/:rollno', requireAuth, getUserComments);

export default commentRoutes
