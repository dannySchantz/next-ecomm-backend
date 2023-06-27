import  express from 'express';
// import dotenv from 'dotenv';
import Stripe from 'stripe';
// import auth from '../middlewares/auth.js';

// dotenv.config();
const router = express.Router()
const stripe = Stripe(process.env.STRIPE_SECRET);

router.post('/', async (req, res) => {
    const imagePrice = req.body.price * 100
    const imageTitle = req.body.title
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: imageTitle,
            },
            unit_amount: imagePrice
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: 'http://127.0.0.1:5173/success',
      cancel_url: 'http://127.0.0.1:5173/cancel',
    });
  
    // res.redirect(303, session.url);
    return res.json(session.url)
  });

export default router