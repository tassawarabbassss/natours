const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//Router Handlers or Controllers

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'bad request',
      message: 'Missing price or name'
    });
  }
  next();
};

exports.checkId = (req, res, next, val) => {
  // console.log(`Tour id is :${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};
exports.deleteTour = (req, res) => {
  //___THE DELETE LOGIC IS NOT IMPLEMENTED HERE__________________________//
  //___Here it just shows how a DELETE Request is handled_________//

  res.status(204).json({
    status: 'success',
    data: null
  });
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  });
};

exports.getTour = (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find(element => element.id === id);
  //if(id > tours.length){}
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour
    }
  });
};

exports.createNewTour = (req, res) => {
  //  console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );

  //res.send('Data Recieved😍');
};

exports.updateTour = (req, res) => {
  //___THE UPDATE LOGIC IS NOT IMPLEMENTED HERE__________________________//
  //___Here it just shows how a PATCH Request is handled_________//

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};
