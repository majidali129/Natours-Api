import { apiFeatures } from '../utils/apiFeatures.js';
import { appError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getAll = Model =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new apiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .selectFields()
      .paginate();
    // EXECUTE QUERY
    const docs = await features.query; // 👇🏼 result of all above features
    // query.sort().select().skip().limit()

    // SEND RESPONSE
    res.status(200).json({
      message: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });
  });

const getOne = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    if (!doc) {
      return next(new appError('Document not found for that ID', 404));
    }
    res.status(200).json({
      message: 'success',
      requestedAt: req.requestTime,
      data: {
        data: doc
      }
    });
  });

const createOne = Model =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);
    if (!doc)
      return next(new appError('Failed to add new document. Please try again', 403));
    res.status(201).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

const updateOne = Model =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true
    });
    if (!doc) {
      return next(new appError('No document found for that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

const deleteOne = Modal =>
  asyncHandler(async (req, res, next) => {
    const doc = await Modal.findByIdAndDelete({ _id: req.params.id });
    if (!doc) return next(new appError('Document not found for that ID', 404));

    res.status(200).json({
      status: 'success',
      data: null
    });
  });

export { deleteOne, createOne, updateOne, getAll, getOne };
