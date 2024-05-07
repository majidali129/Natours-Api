import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// import { Tour } from '../../src/models/tour.model.js';
import { Review } from '../../src/models/view.model.js';
import { connectDB } from '../../src/db/index.js';
import { app } from '../../src/app.js';
const tours = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

dotenv.config({
  path: './config.env'
});

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

// import data into db
const importData = async () => {
  try {
    await Review.create(tours);
    // await Tour.create(tours);
    console.log('Data imported successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// delete data from db
const deleteData = async () => {
  try {
    await Review.deleteMany();
    // await Tour.deleteMany();
    console.log('Data deleted successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  await importData();
  console.log('import called');
} else if (process.argv[2] === '--delete') {
  console.log('delete called');
  await deleteData();
}
