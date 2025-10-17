import express from 'express';
import connectDatabase from './config/dbConfig';
import { env } from './config/serverConfig';
import { errorHandler } from './middleware/errorMiddleware';
import apiRouter from './routers/api.router';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);

app.use('/api', apiRouter);

// app.use('/ping', (req: Request, res: Response) => {
//   res.send('Hello, TypeScript Backend');
// });

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
  connectDatabase();
});
