import { Review } from '../models/review.model.js';
import { appError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getAllReviews = asyncHandler(async (req, res, next) => {
  // Passes tour as parameter to find, in case if user tries to get reviews for a specific tour. if not it'll get all reviews;
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

const addNewReview = asyncHandler(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const review = await Review.create(req.body);
  if (!review) return next(new appError('Failed to add review. Please try again', 403));
  res.status(201).json({
    status: 'success',
    data: {
      review
    }
  });
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const result = await Review.deleteMany({ tour: req.params.id });
  res.status(200).json({
    status: 'success'
  });
});

export { getAllReviews, addNewReview, deleteReview };
