import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

const port = Number(process.env.PORT) || 5000;

// Connect to the database before accepting requests so the API never starts in a degraded state.
const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.info(`Campus Connect API running on port ${port} in ${process.env.NODE_ENV} mode`);
  });
};

startServer();
