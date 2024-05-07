import express from 'express';
import {
  getAllTours,
  addNewTour,
  deleteTour,
  getTour,
  updateTour,
  getTourStats,
  getMonthlyPlans
} from '../controllers/tour.controller.js';
import { aliasTopTours } from '../middlewares/aliasTopTours.js';
import { protectRoute } from '../middlewares/protectRoute.js';
import { restrectRoute } from '../middlewares/restrictRouteByRole.js';
// import reviewRouter from './routes/review.routes.js';
import reviewRouter from '../routes/review.routes.js';

const router = express.Router();

// Nested routing in express
// router.route('/:tourId/review').post(protectRoute, restrectRoute('user'), addNewReview);

// here we are telling to express, go and use reviewRouter if you ever encounter route like /:id/review
// Note: router itself is a middleware. that's why we can use 'use' on it to instruct for usage of reviewRouter
router.use('/:tourId/reviews', reviewRouter); // Similar to mounting the routes
// It will go to reviewRouter (in app.js, as it starts with /tours) then from there it'll move to tourRouter. means it'll come back here. By this we decoupled the 2 routes. to access id of tour, we use mergeParams pattern of express;

router.route('/monthly-plan/:year').get(getMonthlyPlans);
router.route('/tour-stats').get(getTourStats);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/').get(protectRoute, getAllTours).post(addNewTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protectRoute, restrectRoute('admin', 'lead-guide'), deleteTour);

export default router;
