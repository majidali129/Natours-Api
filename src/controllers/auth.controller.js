import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { appError } from '../utils/appError.js';

const assignToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
export const signUp = asyncHandler(async (req, res, next) => {
  // CREATE NEW USER TO DB
  // const user = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   confirmPassword: req.body.confirmPassword
  // });
  const user = await User.create(req.body);
  if (!user) {
    return next(new appError('User creation error', 404));
  }
  // GENERATE TOKEN AND ADD TO RESPONSE FOR CLIENT
  const token = assignToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
    message: 'User created successfully 🎆',
    data: {
      user
    }
  });
});

export const logIn = asyncHandler(async (req, res, next) => {
  //  RECEIVE EMAIL PASSWORD FROM CLIENT
  // VALIDATE CREDIENTIALS
  // CHECK FOR EXISTANCE OF USER
  // VALIDATE FOR PASSWORD && TOKEN
  // EVERYTHING IS OK. SEND RESPONSE WITH 200 ALONG WITH TOKEN
  const { email, password } = req.body;
  if (!(email || password)) return next(new appError('Please provide email and password', 400));
  const user = await User.findOne({ email }).select('+password');
  console.log('login user', user);
  if (!user || !(await user.isPasswordCorrect(password, user.password)))
    return next(new appError('Invalid email or passowrd', 401));
  let token = assignToken(user._id);

  res.status(200).json({
    status: 'success',
    token: token
  });
});

export const protectRoute = asyncHandler(async (req, res, next) => {
  // 1> CHECK IF TOKEN IS EXISTS
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new appError('You are not logged in! please log in to get access', 401));
  // 2> TOKEN VARIFICATION
  // const decoded = await jwt.verify(token, process.env.JWT_SECRET)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3> CHACK IF USER EXISTS STILL
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new appError('User belonging to this token does no longer exists', 401));
  // 4> CHECK IF USER UPDATE HIS PASSWORD AFTER ISSUING NEW TOKEN
  if (currentUser.checkForPasswordChangeAfterTokenIssue(decoded.iat))
    return next(new appError('User recently changed password! Please log in again.', 401));
  // 5> IF EVERYTHING GOES CORRECT, MOVE ON TO NEXT => PROTECTED ROUTE
  req.user = currentUser;
  next();
});
