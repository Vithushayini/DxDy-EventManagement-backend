import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { createApp } from './app.js';

dotenv.config();

const port = process.env.PORT || 8080;
const app = createApp();

await connectDB();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
