import { Tour } from '../models/tour.model.js';
import { apiFeatures } from '../utils/apiFeatures.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getAllTours = asyncHandler(async (req, res) => {
  const features = new apiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .selectFields()
    .paginate();
  // EXECUTE QUERY
  const tours = await features.query; // 👇🏼 result of all above features
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

// PIPELINE FOR CALCULATING STATS
const getTourStats = asyncHandler(async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.3 }
        }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsAverage' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
});

// PIPLINE FOR BUSIEST MONTH OF YEAR
const getMonthlyPlans = asyncHandler(async (req, res) => {
  try {
    const year = +req.params.year;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numOfToursStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numOfToursStarts: -1 }
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
});

export {
  getAllTours,
  getTour,
  addNewTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlans
};
