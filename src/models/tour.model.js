import mongoose from 'mongoose';

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
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
      required: [true, 'A tour must have difficulty level']
    },
    ratingsAverage: {
      type: Number,
      default: 4.2
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    priceDiscount: Number,
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
  { timestamps: true }
);

export const Tour = mongoose.model('Tour', tourSchema);
