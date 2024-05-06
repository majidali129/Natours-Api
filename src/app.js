import express from 'express';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import tourRouter from './routes/tour.routes.js';
import userRouter from './routes/user.routes.js';
import { appError } from './utils/appError.js';
import globalErrorController from './controllers/errorController.js';

export const app = express();

// GLOBAL MIDDLEWARES
app.use(helmet());
// Limit the requests from same IP
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Try again after 45 minutes'
});
// For development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// To accept body in req.body
app.use(express.json({ limit: '100kb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sanitize data against noSQL query injection
app.use(mongoSanitize());

// Sanitization againt XSS attacks
app.use(xss());

// To prevent brute force / DOS  attacks
app.use('/api', limiter);

// Preventing the url population
app.use(
  hpp({
    whitelist: ['price', 'duration', 'maxGroupSize', 'difficulty', 'ratingsAverage']
  })
);

// To serve static files
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
