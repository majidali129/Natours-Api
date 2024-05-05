import { appError } from '../utils/appError.js';

export const restrectRoute = (...roles) => {
  console.log(roles);
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new appError('You do not have permission to perform this action', 403));

    next();
  };
};
