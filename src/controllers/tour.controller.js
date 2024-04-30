import { Tour } from '../models/tour.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getAllTours = asyncHandler(async (req, res) => {
  console.log(req.query);
  // BUILD QUERY
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'limit', 'sort', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // ADVANCE FILTERING
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte)\b/g,
    match => `$${match}`
  );

  let query = Tour.find(JSON.parse(queryString));

  // SORTING
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    console.log('sortBy::', sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort('createdAt');
  }

  // FIELDS SELECTION
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // PAGENATIONS
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);
  // page=2&limit=10   page1-(results 1-10, skip-(0)) page2-(results 11-20, skip-(1-10))

  if (req.query.page) {
    const totalResults = await Tour.countDocuments();
    console.log(totalResults);
    if (skip >= totalResults)
      throw new Error('The page you are looking for does not exist');
  }

  // EXECUTE QUERY
  const tours = await query; // 👇🏼 result of all above features
  // query.sort().select().skip().limit()

  // SEND RESPONSE
  res.status(200).json({
    message: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});
const getTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  res.status(200).json({
    message: 'success',
    requestedAt: req.requestTime,
    data: {
      tour
    }
  });
});
const addNewTour = asyncHandler(async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Tour created successfully',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: `Invalid Data !!!:: ${error}`
    });
  }
});

const updateTour = asyncHandler(async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true
    });
    res.status(200).json({
      status: 'success',
      message: 'Tour updated successfully',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Not found'
    });
  }
});

const deleteTour = asyncHandler(async (req, res) => {
  try {
    await Tour.deleteOne({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      message: 'Tour Deleted Successfully'
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Not Found'
    });
  }
});

export { getAllTours, getTour, addNewTour, updateTour, deleteTour };
