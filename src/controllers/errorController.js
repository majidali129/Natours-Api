import { appError } from "../utils/appError.js";

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack:err.stack,
  });
}
const sendErrorProd = (err, res) => {
  // operational error,:: trusted errors, send meaningful message to user
  if(err.isOperational){
    res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
  // programming error or other unknown:: don't leak error details;
}else{
  // 1) Log error
  console.error('ERROR 💥', err);

  // 2) Send generic message
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!!!'
  });
}
}

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new appError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new appError(message, 400)
}

const handleValidationError = err => {
  const errors = Object.values(err.errors).map(el => el.message).join('. ');
  const message = `Invalid input data. ${errors}`;
  return new appError(message, 400)
}
const globalErrorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if(process.env.NODE_ENV.trim() ==='development'){
    sendErrorDev(err, res)
  }else if(process.env.NODE_ENV.trim() === 'production'){
    let error = {...err, message: err.message, name: err.name};
    // let error = JSON.parse(JSON.stringify(err));
    // error = {...error, message: err.message}
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    // user origional err. b/c i need errmsg preperty which is not available on err
    if (error.code === 11000) error = handleDuplicateFieldsDB(err);
    if (error.name === 'ValidationError') error = handleValidationError(err);
    sendErrorProd(error, res)
  }
};

export default globalErrorController;
