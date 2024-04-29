const checkBody = (req, res, next) => {
  // console.log(`Here is the body: ${req.body}`);
  // if (!req.body.name || !req.body.price) {
  //   return res.status(400).json({
  //     status: 'fail',
  //     message: 'name and price fields are required',
  //   });
  // }
  // next();
};

const getAllTours = (req, res) => {
  // res.status(200).json({
  //   message: 'success',
  //   results: tours.length,
  //   data: {
  //     tours,
  //   },
  // });
};
const getTour = (req, res) => {
  const id = +req.params.id;
  // const targetTour = tours.find(tour => tour.id === id);
  // res.status(200).json({
  //   message: 'success',
  //   requestedAt: req.requestTime,
  //   data: {
  //     tour: targetTour,
  //   },
  // });
};
const addNewTour = (req, res) => {
  // const newTour = Object.assign({ id: newId }, req.body);
  // res.status(201).json({
  //   status: 'success',
  //   data: { tour: newTour },
  // });
};
const updateTour = (req, res) => {};
const deleteTour = (req, res) => {
  // res.status(200).json({
  //   status: 'success',
  //   message: 'Tour Deleted Successfully',
  // });
};

export { getAllTours, getTour, addNewTour, updateTour, deleteTour, checkBody };
