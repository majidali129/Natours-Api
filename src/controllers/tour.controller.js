import { Tour } from '../models/tour.model.js';
import { appError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory.js';

const getAllTours = getAll(Tour);
const updateTour = updateOne(Tour);
const addNewTour = createOne(Tour);
const deleteTour = deleteOne(Tour);
const getTour = getOne(Tour, { path: 'reviews' });

const aliasTopTours = (req, _, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty,summary';
  next();
};

// PIPELINE FOR CALCULATING STATS
const getTourStats = asyncHandler(async (req, res, next) => {
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
});

// PIPLINE FOR BUSIEST MONTH OF YEAR
const getMonthlyPlans = asyncHandler(async (req, res, next) => {
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
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/400/center/34.0996666470141,-118.17805010835912/mi
const getToursWithin = asyncHandler(async(req, res, next) => {
  const {distance,latlng, unit} = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi'? distance / 3963.2 : distance / 6378.1;

  if(!lat || !lng) next(new appError('Please provide latitude and longitude in the formate lat,lng', 400))


    const tours = await Tour.find({
      startLocation: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius]
        }
      }
    });

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        data:tours
      }
    })
})

const getDstances = asyncHandler(async(req, res, next) => {
  const {latlng, unit} = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi'? 0.000621371: 0.001
  if(!lat || !lng) next(new appError('Please provide latitude and longitude in the formate lat,lng', 400))

    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng*1 , lat*1]
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier
        },
      },
      {
        $project:{
        name: 1,
        distance: 1
      }
    }
    ])
  res.status(200).json({
    status: 'success',
    data: {
      data:distances
    }
  })
})
export {
  getAllTours,
  getTour,
  addNewTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlans,
  aliasTopTours,
  getToursWithin,
  getDstances
};
