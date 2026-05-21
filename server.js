import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';
import { createApp } from './app.js';

dotenv.config();

const port = process.env.PORT || 8080;
const app = createApp();

await connectDatabase();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
