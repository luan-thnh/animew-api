import { Schema, model, Types } from 'mongoose';
import { IUser } from './userModel';
import { IAnime } from './animeModel';
import { IEpisode } from './episodeModel';

export interface IWatchList {
  userId: Types.ObjectId | IUser;
  animeId: Types.ObjectId | IAnime;
}

const WatchListSchema = new Schema<IWatchList>({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  animeId: { type: Types.ObjectId, ref: 'Anime', required: true },
});

const WatchListModel = model<IWatchList>('WatchList', WatchListSchema);

export default WatchListModel;
