import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { appError } from '../utils/appError.js';
import { sendEmail } from '../utils/sendEmail.js';

const assignToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
// expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
const cookieOptions = {
  expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  httpOnly: true
};

const createSendToken = (user, statusCode, res) => {
  const token = assignToken(user._id);
  if (process.env.NODE_ENV.trim() === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  });
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};
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
  user.password = undefined;
  // GENERATE TOKEN AND ADD TO RESPONSE FOR CLIENT
  createSendToken(user, 201, res);
});

export const logIn = asyncHandler(async (req, res, next) => {
  //  RECEIVE EMAIL PASSWORD FROM CLIENT
  // VALIDATE CREDIENTIALS
  // CHECK FOR EXISTANCE OF USER
  // VALIDATE FOR PASSWORD && TOKEN
  // EVERYTHING IS OK. SEND RESPONSE WITH 200 ALONG WITH TOKEN
  const { email, password } = req.body;
  if (!(email || password))
    return next(new appError('Please provide email and password', 400));
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.isPasswordCorrect(password, user.password)))
    return next(new appError('Invalid email or passowrd', 401));
  user.password = undefined;
  createSendToken(user, 200, res);
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new appError('There is no user with this email !!!!', 404));

  //  2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      text: message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email successfully!'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log('catch block runs');

    console.log(error);
    return next(
      new appError('There was an issue sending the email. Try again later!', 500)
    );
  }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  // Find user based on token
  // Varify token => if not expired, user is exist then set new password
  // Remove reset token from db
  // Update passowrdChangedAt property
  // Log in the user, send JWT
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) return next(new appError('Token is invalid or has expired', 400));
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: true });
  createSendToken(user, 201, res);
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  // Get the user from db
  const user = await User.findById(req.user.id).select('+password');
  // Check for password if correct
  if (!(await user.isPasswordCorrect(req.body.currentPassword, user.password)))
    return next(new appError('Your entered old password is not correct', 401));
  // if so, update the password
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmNewPassword;
  await user.save();
  // Log in the user, send JWT
  createSendToken(user, 200, res);
});
