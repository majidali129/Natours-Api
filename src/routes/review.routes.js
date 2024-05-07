import express from 'express';
import {
  addNewReview,
  deleteReview,
  getAllReviews
} from '../controllers/review.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';
import { restrectRoute } from '../middlewares/restrictRouteByRole.js';

const router = express.Router();

router
  .route('/')
  .get(getAllReviews)
  .post(protectRoute, restrectRoute('user'), addNewReview);

router.route('/:id').delete(protectRoute, restrectRoute('user'), deleteReview);

export default router;
