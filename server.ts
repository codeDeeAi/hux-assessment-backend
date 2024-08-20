import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import Env from './src/libs/support/env';
import db from './src/libs/database/database';
import appRoutes from "./src/routes/index.router";
import limiter from './src/libs/security/rateLimit';
import ApiResponse from './src/libs/support/apiResponse';
import express, { Application, Request, Response } from 'express';

dotenv.config();

const {
  PORT,
  NODE_ENV,
  SERVER_HOST } = Env;

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.set('trust proxy', (NODE_ENV === 'production')); // Enable 'trust proxy' setting
app.use('/api', limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

export const root_app = app;

export const server = createServer({}, app);

app.use('/api', appRoutes);

app.get('/', async (req: Request, res: Response) => {
  try {

    return ApiResponse.success(res, 'Welcome to Hux Ventures Contacts app Server', null);

  } catch (error: any) {

    return ApiResponse.serverError(res, 'Error seeding DB', error?.message);
  }
});

app.all("*", (req: Request, res: Response) => {
  return ApiResponse.error(res, 404, "Route not found", "Route not found");
});

server.listen(PORT, SERVER_HOST, async () => {

  try {

    await db();

    console.log(`MongoDB::Connected to NoSQL DB`);

    console.log(`⚡️[server]: Server is running on port:${PORT}`);

  } catch (error) {
    console.error('Error starting server:', error);

    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received.');

  server.close(() => {
    console.log('Server closed.');

    process.exit(0);
  });
});