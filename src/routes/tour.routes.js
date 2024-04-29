import express from 'express';
import {
  getAllTours,
  addNewTour,
  deleteTour,
  getTour,
  updateTour,
} from '../controllers/tour.controller.js';
const router = express.Router();

router.route('/').get(getAllTours).post(addNewTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
