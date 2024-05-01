import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have equal or less than 40 characters'],
      minLength: [10, 'A tour name must have equal or more than 10 characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    secretTour: {
      type: Boolean,
      default: false
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty level'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty can be either easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.2,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    priceDiscount: {
      type: Number,
      validate: function (val) {
        return val < this.price;
      },
      message: 'Discount price {VALUE} should be less than regular price'
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    startDates: [Date]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// NOTE: virtial propertis never become the part of DB; but they are usefull for business logic/calculations/ as computer preperties
tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE, THAT WILL TRIGGER BEFORE AND AFTER THE CURRENT RUNNING DOCUMENT SAVE TO THE DB; IT'LL NOT TRIGGLE ON FINDONE/FINDMANY FINDbyID/FINDbyIDandUPDATE
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

// IT WILL RUN AFTER THE DOCUMENT SAVE TO DB
tourSchema.post('save', function (doc, next) {
  doc.difficulty = doc.difficulty.toUpperCase();
  next();
});

// QUERY MEDDLEWARES, WILL RUN WHENEVER WE HIT A QUERY
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// AGGREGATION MEDDLEWARES, WILL RUN WHENEVER WE PERFORM AGGREGATION
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
export const Tour = mongoose.model('Tour', tourSchema);
