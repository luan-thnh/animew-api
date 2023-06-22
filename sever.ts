import path from 'path';
import dotenv from 'dotenv';

const envPath = path.join(__dirname, '..', 'env', '.env');
dotenv.config();

import { connect } from './src/configs/connect_db';
connect();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './src/routers/authRoute';
import adminRoute from './src/routers/adminRoute';
import animeRoute from './src/routers/animeRoute';
import commentRoute from './src/routers/commentRoute';
import profileRoute from './src/routers/profileRoute';
import { errorHandler, HttpError } from './src/middleware/errorHandler';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.status(200).json({
    Authentication: '/api/v1/auth',
    Admin: '/api/v1/admin',
    Anime: '/api/v1/anime',
    Comments: '/api/v1/comments',
    Profile: '/api/v1/profile',
  });
});

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

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () =>
  console.log(`⚡Welcome to AnimeW! Sever is running: http://localhost:${PORT}/api/v1`),
);
