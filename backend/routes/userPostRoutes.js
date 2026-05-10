import express from "express";
import {
  userCreateLostPost,
  userDeleteLostPost,
  userGetLostPost,
  userCreateFoundPost,
  userDeleteFoundPost,
  userGetFoundPost,
  getPostData,
  getPostsByRollNo,
  getUnverifiedPostsByRollNo,
  getRecent6Posts,
  getStatistics,
} from "../controllers/postController.js";

import upload from "../middleware/upload.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/lost", requireAuth, upload.single("image"), userCreateLostPost);
router.get("/lost", userGetLostPost);
router.delete("/lost/:postId", requireAuth, userDeleteLostPost);
router.post("/found", requireAuth, upload.single("image"), userCreateFoundPost);
router.get("/found", userGetFoundPost);
router.delete("/found/:postId", requireAuth, userDeleteFoundPost);
router.get('/getPostData', getPostData)
router.get('/rollno/:rollno', requireAuth, getPostsByRollNo);
router.get('/unverified/rollno/:rollno', requireAuth, getUnverifiedPostsByRollNo);
router.get('/recent6', getRecent6Posts);
router.get('/statistics', getStatistics);

export default router;