import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import app from './index.js';

const PORT = process.env.PORT || 3001;

// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`.blue);
  });
});
