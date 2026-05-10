import express from "express";
import {
  createLostPostController,
  createFoundPostController,
  getLostPost,
  updateLostPost,
  deleteLostPost,
  getFoundPost,
  updateFoundPost,
  deleteFoundPost,
  getPostData,
  getRecent6Posts,
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/lost", createLostPostController);
postRouter.get("/lost", getLostPost);
postRouter.put("/lost/:postId", updateLostPost);
postRouter.delete("/lost/:postId", deleteLostPost);
postRouter.post("/found", createFoundPostController);
postRouter.get("/found", getFoundPost);
postRouter.put("/found/:postId", updateFoundPost);
postRouter.delete("/found/:postId", deleteFoundPost);
postRouter.get('/getPostsData',getPostData);
postRouter.get('/recent6', getRecent6Posts);

export default postRouter;