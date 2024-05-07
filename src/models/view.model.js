import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Can't post an empty review"]
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    },
    reviewInfo: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour'
      }
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name'
  }).populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

export const Review = mongoose.model('Review', reviewSchema);
