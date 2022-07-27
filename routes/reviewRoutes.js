const express = require('express');
const Review = require('./../models/reviewModel');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

// Router
const router = express.Router({ mergeParams: true });

// This Router now can handle both routes below
//    1) POST / tours/14342/reviews
//    2) POST / reviews

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createNewReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );
module.exports = router;
