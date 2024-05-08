import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { appError } from '../utils/appError.js';
import { deleteOne, updateOne, getAll, getOne } from './handlerFactory.js';

const filterBody = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const updateMe = asyncHandler(async (req, res, next) => {
  // Give error message if user tries to update passwords
  if (req.body.password || req.body.confirmPassword)
    return next(
      new appError('This route is not for password updates. Please use /updatePassword')
    );
  // Filter request for required fields
  const filteredBody = filterBody(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidator: true
  });

  // Send success message, response
  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

const deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  // Send success message, response
  res.status(204).json({
    status: 'success',
    data: null
  });
});

const createUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'This route is not defined yet'
  });
};

const getUser = getOne(User);
const getAllUsers = getAll(User);
const deleteUser = deleteOne(User);
const updateUser = updateOne(User);

export { getAllUsers, getUser, updateUser, createUser, updateMe, deleteMe, deleteUser };
