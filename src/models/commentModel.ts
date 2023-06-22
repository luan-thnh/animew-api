import { Schema, model, Types } from 'mongoose';
import { IAnime } from './animeModel';
import { IUser } from './userModel';

export interface IComment {
  author: Types.ObjectId | IUser;
  anime: Types.ObjectId | IAnime;
  content: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  anime: { type: Schema.Types.ObjectId, ref: 'Anime', required: true },
  content: { type: String, required: [true, 'Comment must have content'], trim: true },
  createdAt: { type: Date, default: Date.now },
});

const CommentModel = model<IComment>('Comment', CommentSchema);

export default CommentModel;
