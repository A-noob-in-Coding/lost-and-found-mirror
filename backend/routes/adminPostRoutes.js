import express from "express";
import {
  adminUpdateLostPost,
  adminDeleteLostPost,
  adminUpdateFoundPost,
  adminDeleteFoundPost,
  getAdminPosts,
  getAllPostsForAdmin,
  adminApproveAllPosts,
} from "../controllers/postController.js";
import { requireAuth } from "../middleware/auth.js";
const router = express.Router();

router.get("/", requireAuth, getAdminPosts);
router.get("/all", requireAuth, getAllPostsForAdmin);
router.put('/approve-all', requireAuth, adminApproveAllPosts);
router.put("/lost", requireAuth, adminUpdateLostPost);
router.delete("/lost", requireAuth, adminDeleteLostPost);
router.put("/found", requireAuth, adminUpdateFoundPost);
router.delete("/found", requireAuth, adminDeleteFoundPost);

export default router;