import express from 'express';
import {
  addNewTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
} from '../controllers/tour.controller.js';
export const router = express.Router();

router.route('/').get(getAllTours).post(addNewTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
