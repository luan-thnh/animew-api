import path from 'path';
import dotenv from 'dotenv';

const envPath = path.join(__dirname, '..', 'env', '.env');
dotenv.config({ path: envPath });

import { connect } from './configs/connect_db';
connect();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routers/authRoute';
import adminRoute from './routers/adminRoute';
import animeRoute from './routers/animeRoute';
import commentRoute from './routers/commentRoute';
import profileRoute from './routers/profileRoute';
import { errorHandler, HttpError } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/anime', animeRoute);
app.use('/api/v1/comments', commentRoute);
app.use('/api/v1/profile', profileRoute);

app.all('*', (req, res, next) => {
  const error = new HttpError('The route can not be found!', 404);
  next(error);
});
app.use(errorHandler);

const PORT = process.env.APP_PORT;
app.listen(PORT, () =>
  console.log(`⚡Welcome to AnimeW! Sever is running: http://localhost:${PORT}/api/v1`),
);
