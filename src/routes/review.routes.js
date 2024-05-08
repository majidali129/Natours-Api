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

router.use(protectRoute);

router
  .route('/')
  .get(getAllReviews)
  .post(restrectRoute('user'), addTourUserIds, addNewReview);

router
  .route('/:id')
  .get(getReview)
  .delete(restrectRoute('user', 'admin'), deleteReview)
  .patch(restrectRoute('user', 'admin'), updateReview);

export default router;
