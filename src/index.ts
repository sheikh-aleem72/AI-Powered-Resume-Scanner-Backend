import express, { Request, Response } from 'express';
import connectDatabase from './config/dbConfig';

const app = express();

const PORT = 5000;

app.use('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Backend');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDatabase();
});
