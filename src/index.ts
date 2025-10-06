import express, { Request, Response } from 'express';
import connectDatabase from './config/dbConfig';
import { env } from './config/serverConfig';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();

app.use('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Backend');
});

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
  connectDatabase();
});
