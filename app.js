import express from 'express';
import morgan from 'morgan';

// import { tourRouter } from './routes/tour.routes.js';
import tourRouter from './routes/tour.routes.js';
import userRouter from './routes/user.routes.js';

export const app = express();

// MIDDLEWARES
// responsible to parse incoming req data (in the form of stream ) into a formate that is usable. specially json data
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTER MOUNTING
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
