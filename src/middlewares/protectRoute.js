import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { User } from '../models/user.model.js';
import { appError } from '../utils/appError.js';

export const protectRoute = asyncHandler(async (req, res, next) => {
  // 1> CHECK IF TOKEN IS EXISTS
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(new appError('You are not logged in! please log in to get access', 401));
  // 2> TOKEN VARIFICATION
  // const decoded = await jwt.verify(token, process.env.JWT_SECRET)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3> CHACK IF USER EXISTS STILL
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new appError('User belonging to this token does no longer exists', 401));
  // 4> CHECK IF USER UPDATE HIS PASSWORD AFTER ISSUING NEW TOKEN
  if (currentUser.checkForPasswordChangeAfterTokenIssue(decoded.iat))
    return next(
      new appError('User recently changed password! Please log in again.', 401)
    );
  // 5> IF EVERYTHING GOES CORRECT, MOVE ON TO NEXT => PROTECTED ROUTE
  req.user = currentUser;
  next();
});
