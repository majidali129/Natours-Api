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
  })
  .catch(error => {
    console.log('MongoDB Connection Failed::', error);
  });

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('App is listening at port 8000');
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
