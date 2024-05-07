import { Review } from '../models/view.model.js';
import { appError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getAllReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

const addNewReview = asyncHandler(async (req, res, next) => {
  const review = await Review.create(req.body);
  if (!review) return next(new appError('Failed to add review. Please try again', 403));
  res.status(201).json({
    status: 'success',
    data: {
      review
    }
  });
});

export { getAllReviews, addNewReview };
