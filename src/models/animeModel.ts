import { Schema, model, Types } from 'mongoose';
import { IEpisode } from './episodeModel';

export interface IAnime {
  title: string;
  type: string;
  imageUrl: string;
  description: string;
  releaseDate: Date;
  episodeCount: number;
  rating: number;
  genres: string[];
  episodes: IEpisode[];
}

const AnimeSchema = new Schema<IAnime>({
  title: { type: String, trim: true, required: [true, 'Title is required'] },
  type: {
    type: String,
    trim: true,
    required: [true, 'Type is required'],
    validate: {
      validator(value: string) {
        return value === 'Series' || value === 'OVA';
      },
      message: 'Type must be "Series" or "OVA"',
    },
  },
  imageUrl: { type: String, trim: true, required: [true, 'Image is required'] },
  description: { type: String, trim: true, required: [true, 'Description is required'] },
  releaseDate: { type: Schema.Types.Mixed },
  episodeCount: {
    type: Number,
    required: [true, 'Episode number is required'],
    min: [1, 'Episode number must be at least 1'],
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating cannot exceed 10'],
    validate: {
      validator(value: number) {
        return value >= 1 && value <= 10;
      },
      message: 'Rating must be between 1 and 10',
    },
  },
  genres: {
    type: [String],
    required: [true, 'Genre is required'],
    validate: {
      validator(value: string[]) {
        return value.length > 0;
      },
      message: 'At least one genre must be specified',
    },
  },
  episodes: [{ type: Schema.Types.ObjectId, ref: 'Episode' }],
});

const AnimeModel = model<IAnime>('Anime', AnimeSchema);

export default AnimeModel;
