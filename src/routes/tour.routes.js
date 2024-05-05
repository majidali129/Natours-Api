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
const router = express.Router();

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
