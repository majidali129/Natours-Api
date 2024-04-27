import express from 'express';
import morgan from 'morgan';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import tourRouter from './routes/tour.routes.js';
import userRouter from './routes/user.routes.js';

const __filename = fileURLToPath('.', import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: './config.env',
});
console.log('windowl');
export const app = express();
// MIDDLEWARES
// responsible to parse incoming req data (in the form of stream ) into a formate that is usable. specially json data
process.env.NODE_ENV === 'development' && app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, _, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
console.log('winslow');
// ROUTER MOUNTING
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
