import express from "express";
import {
  sendFoundItemNotification,
  sendClaimItemNotification,
  getUserNotifications,
  getUserNotificationCount,
  removeNotification
} from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/auth.js";

const notificationRouter = express.Router();

notificationRouter.post('/found-item', requireAuth, sendFoundItemNotification);
notificationRouter.post('/claim-item', requireAuth, sendClaimItemNotification);
notificationRouter.get('/user/:email', requireAuth, getUserNotifications);
notificationRouter.get('/count/:email', requireAuth, getUserNotificationCount);
notificationRouter.delete('/:id', requireAuth, removeNotification);

export default notificationRouter;
