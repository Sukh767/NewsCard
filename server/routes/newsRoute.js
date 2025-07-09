import express from 'express';
import auth from '../middleware/auth.js';
import { upload } from '../config/multerConfig.js';
import {
  getAllNews,
  getFeaturedNews,
  getCategories,
  getSingleNews,
  createNews,
  updateNews,
  deleteNews
} from '../controller/newsController.js';

const router = express.Router();

// Public routes
router.get('/', getAllNews);
router.get('/featured', getFeaturedNews);
router.get('/categories', getCategories);
router.get('/:id', getSingleNews);

// Admin-only routes
router.post('/', auth, upload.single('image'), createNews);
router.put('/:id', auth, upload.single('image'), updateNews);
router.delete('/:id', auth, deleteNews);

export default router;
