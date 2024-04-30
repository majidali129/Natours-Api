import express from 'express';
import {
  getAllTours,
  addNewTour,
  deleteTour,
  getTour,
  updateTour
} from '../controllers/tour.controller.js';
import { aliasTopTours } from '../middlewares/aliasTopTours.js';
const router = express.Router();

// for top 5 cheap tours
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/').get(getAllTours).post(addNewTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
