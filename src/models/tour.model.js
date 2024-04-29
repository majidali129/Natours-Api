import mongoose from 'mongoose';

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  rating: {
    type: Number,
    required: true,
    default: 4.2,
  },
});

export const Tour = mongoose.model('Tour', tourSchema);
