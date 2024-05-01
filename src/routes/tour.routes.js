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
const router = express.Router();

router.route('/monthly-plan/:year').get(getMonthlyPlans);
router.route('/tour-stats').get(getTourStats);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/').get(getAllTours).post(addNewTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
