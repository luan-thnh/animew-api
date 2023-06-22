import { Schema, Types, model } from 'mongoose';
import { IUser } from './userModel';

export interface IProfile {
  author: Types.ObjectId | IUser | string | null | undefined;
  avatar: string;
  fullName: string;
  age: number;
  address: string;
  description: string;
  level: number;
}

const ProfileSchema = new Schema<IProfile>(
  {
    author: { type: Types.ObjectId, ref: 'User' },
    fullName: {
      type: String,
      // required: [true, 'Full name is required'],
      // minlength: [3, 'Username must be at least 3 characters!'],
    },
    age: {
      type: Number,
    },
    address: { type: String },
    description: { type: String },
    level: { type: Number, default: 0 },
    avatar: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const ProfileModel = model<IProfile>('Profile', ProfileSchema);

export default ProfileModel;
