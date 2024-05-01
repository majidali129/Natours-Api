import express from 'express';
import morgan from 'morgan';

import tourRouter from './routes/tour.routes.js';
import userRouter from './routes/user.routes.js';
import { appError } from './utils/appError.js';
import globalErrorController from './controllers/errorController.js';

export const app = express();
// MIDDLEWARES
// responsible to parse incoming req data (in the form of stream ) into a formate that is usable. specially json data
process.env.NODE_ENV === 'development' && app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`./public`));
app.use((req, _, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// ROUTER MOUNTING
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// This will run if the requested handler does'nt mapped by any request handler, as it'll be at last position in the middleware stack;
// NOTE: * is for all urls, 'all' is for all request methods;

app.all('*', (req, _, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorController);
