import mongoose from 'mongoose';

const DATABASE_URL = process.env.DB_URL || 'DEFAULT_DB_URL';

export const connect = () => {
  mongoose
    .connect(DATABASE_URL)
    .then(() => console.log('Connected with AnimeW Database!'))
    .catch(() => {
      console.log('Not connected with AnimeW Database!');
      process.exit(1);
    });
};
