import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// READ DATA FROM FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  console.log('req received!!!!!!!!!!!');
  res.status(200).json({
    message: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};
const getTour = (req, res) => {
  const id = +req.params.id;
  const targetTour = tours.find((tour) => tour.id === id);
  if (!targetTour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  res.status(200).json({
    message: 'success',
    requestedAt: req.requestTime,
    data: {
      tour: targetTour,
    },
  });
};
const addNewTour = (req, res) => {
  let newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) console.log(err);
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );
};
const updateTour = (req, res) => {
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
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        message: 'Tour Updated Successfully',
        data: {
          // tour: tourToUpdate,
          tour: tours[id],
        },
      });
    }
  );
};
const deleteTour = (req, res) => {
  tours.splice(req.params.id, 1);
  if (!req.params.id) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        message: 'Tour Deleted Successfully',
      });
    }
  );
};

export { getAllTours, getTour, addNewTour, updateTour, deleteTour };
