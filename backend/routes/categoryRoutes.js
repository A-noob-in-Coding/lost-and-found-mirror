import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', requireAuth, categoryController.createCategory);
router.put('/:id', requireAuth, categoryController.updateCategory);
router.delete('/:id', requireAuth, categoryController.deleteCategory);

export default router;
