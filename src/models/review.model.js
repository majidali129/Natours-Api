import mongoose from 'mongoose';
import { Tour } from './tour.model.js';

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
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


reviewSchema.index({tour: 1, user: 1}, { unique: true })
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    options: { select: 'name photo' }
  });
  next();
});

reviewSchema.statics.calculateAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: 'tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else
    Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
};

// I'll only execute after the new review added to db and then it'll update fields in tour's document;
reviewSchema.post('save', function () {
  // this.constructor.calculateAverageRatings(this.tour);
  this.constructor.calculateAverageRatings(this.tour);
});

// Uddating the property is possible via queries.
/*
findByIdAndUpdate
findByIdAndDelete

these two are not for document. But for queries;
So in query, we don't have direct access to document.
*/
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne(); // this will reture current query. which is newly added review
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});
export const Review = mongoose.model('Review',reviewSchema)
