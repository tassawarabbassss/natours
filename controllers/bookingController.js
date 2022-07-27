const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the Currently Booked Tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    // Session Information
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    //  `${req.protocol}://${req.get('host')}/tours/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    // Product Information
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd', // 'eur
        quantity: 1
      }
    ]
  });

  // 3) Create session as response

  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) return next();

  const booking = await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
  next();
});

exports.createBooking = Factory.createOne(Booking);
exports.getBooking = Factory.getOne(Booking);
exports.getAllBooking = Factory.getAll(Booking);
exports.updateBooking = Factory.updateOne(Booking);
exports.deleteBooking = Factory.deleteOne(Booking);
