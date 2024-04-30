import dotenv from 'dotenv';
import { app } from './app.js';
import { connectDB } from './db/index.js';

dotenv.config({
  path: './config.env'
});
// DB Connection Setup
connectDB()
  .then(() => {
    app.on('error', error => {
      console.log('ERROR::', error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log('App is listening at port 8000');
    });
  })
  .catch(error => {
    console.log('MongoDB Connection Failed::', error);
  });
