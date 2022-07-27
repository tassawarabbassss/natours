/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tourId => {
  // Stripe Function
  const stripe = Stripe(
    'pk_test_51LP3SPC4n1q3gb8iRCmY6zEhpFA24no0K3g39xNZajBYs8w8ALBkGGYpWLqeKtot3WM5UW1KhrPyLn2PugWg9U9D00h5bbwmG2'
  );
  try {
    // 1) Get the checkout session from the server
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    // console.log(session);

    // 2) Create checkout from + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err.message);
  }
};
