import express from 'express';
import {
  addNewReview,
  deleteReview,
  getAllReviews,
  getReview,
  updateReview
} from '../controllers/review.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';
import { restrectRoute } from '../middlewares/restrictRouteByRole.js';
import { addTourUserIds } from '../controllers/review.controller.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protectRoute, restrectRoute('user'), addTourUserIds, addNewReview);

router
  .route('/:id')
  .get(getReview)
  .delete(protectRoute, restrectRoute('user'), deleteReview)
  .patch(restrectRoute('user'), updateReview);

export default router;
