import { Schema, model, Types, Document } from 'mongoose';
import { IAnime } from './animeModel';

export interface IEpisode {
  _id?: Types.ObjectId;
  title: string;
  videoUrl: string;
  episodeNumber: number;
  anime?: Types.ObjectId | IAnime;
}

const EpisodeSchema = new Schema<IEpisode>({
  anime: { type: Types.ObjectId, ref: 'Anime' },
  title: { type: String, required: [true, 'Title is required'] },
  videoUrl: { type: String, required: [true, 'VideoUrl is required'] },
  episodeNumber: { type: Number, required: [true, 'EpisodeNumber is required'] },
});

const EpisodeModel = model<IEpisode>('Episode', EpisodeSchema);

export default EpisodeModel;
