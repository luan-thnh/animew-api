import { Schema, model, Types } from 'mongoose';
import { IUser } from './userModel';
import { IAnime } from './animeModel';
import { IEpisode } from './episodeModel';

export interface IHistory {
  _id: Types.ObjectId;
  userId: Types.ObjectId | IUser;
  animeId: Types.ObjectId | IAnime;
  episodes: IEpisode[];
  watchedMinutes: number;
  createdAt?: string;
}

const HistorySchema = new Schema<IHistory>(
  {
    userId: { type: Types.ObjectId, ref: 'User' },
    animeId: { type: Types.ObjectId, ref: 'Anime', required: true },
    episodes: [{ type: Schema.Types.ObjectId, ref: 'Episode' }],
    watchedMinutes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const HistoryModel = model<IHistory>('History', HistorySchema);

export default HistoryModel;
