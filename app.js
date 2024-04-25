import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// responsible to parse incoming req data (in the form of stream ) into a formate that is usable. specially json data
app.use(express.json());
// READ DATA FROM FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// Request-Response Handlers
const getAllTours = (req, res) => {
    res.status(200).json({
      message: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  },
  getTour = (req, res) => {
    const id = +req.params.id;
    console.log(typeof id);
    const targetTour = tours.find((tour) => tour.id === id);
    if (!targetTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid Id',
      });
    }
    res.status(200).json({
      message: 'success',
      data: {
        tour: targetTour,
      },
    });
  },
  addNewTour = (req, res) => {
    let newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
      if (err) console.log(err);
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    });
  },
  updateTour = (req, res) => {
    const id = +req.params.id;
    console.log(id);
    const tourToUpdate = tours.find((tour) => tour.id === id);
    if (!tourToUpdate) {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid Id',
      });
    }
    const newTour = req.body;
    Object.keys(newTour).forEach((key) => {
      tourToUpdate[key] = newTour[key];
    });
    tours.splice(id, 1, tourToUpdate);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
      res.status(200).json({
        status: 'success',
        message: 'Tour Updated Successfully',
        data: {
          // tour: tourToUpdate,
          tour: tours[id],
        },
      });
    });
  },
  deleteTour = (req, res) => {
    tours.splice(req.params.id, 1);
    if (!req.params.id) {
      res.status(404).json({
        status: 'fail',
        message: 'Invalid ID',
      });
    }
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
      res.status(200).json({
        status: 'success',
        message: 'Tour Deleted Successfully',
      });
    });
  };

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addNewTour);
// ----------------------
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(addNewTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

app.listen(8000, () => {
  console.log('App is listening at port 8000');
});
