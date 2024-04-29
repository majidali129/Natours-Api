import express from 'express';
import morgan from 'morgan';

import tourRouter from './routes/tour.routes.js';
import userRouter from './routes/user.routes.js';

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
