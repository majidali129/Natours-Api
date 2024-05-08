import { Review } from '../models/review.model.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory.js';

const addTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const getAllReviews = getAll(Review);
const addNewReview = createOne(Review);
const deleteReview = deleteOne(Review);
const updateReview = updateOne(Review);
const getReview = getOne(Review);

export {
  getAllReviews,
  addNewReview,
  deleteReview,
  updateReview,
  getReview,
  addTourUserIds
};
