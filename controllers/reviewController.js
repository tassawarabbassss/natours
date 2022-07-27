const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const Factory = require('./handlerFactory');
//Route Handlers or Controllers or Middle wares

exports.setTourUserIds = (req, res, next) => {
  // All nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllReviews = Factory.getAll(Review);
exports.getReview = Factory.getOne(Review);
exports.createNewReview = Factory.createOne(Review);
exports.updateReview = Factory.updateOne(Review);
exports.deleteReview = Factory.deleteOne(Review);
