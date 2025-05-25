import cors from 'cors';

const allowedOrigins = [
  "http://localhost:3000",
  "https://adhunika-ecom-platform.onrender.com",
  "https://checkout.razorpay.com"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

export default cors(corsOptions);
