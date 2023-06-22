import { Schema, Types, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IProfile } from './profileModel';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  profile: Types.ObjectId | IProfile;
}

const UserSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      trim: true,
      required: [true, 'Role must be required!'],
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Username must be required!'],
      minlength: [3, 'Username must be at least 3 characters!'],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Email must be required!'],
      validate: {
        validator(value: string) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: 'Email must be a valid email address!',
      },
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Password must be required!'],
      minlength: [8, 'Password must be at least 8 characters!'],
      validate: {
        validator(value: string) {
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
          return passwordRegex.test(value);
        },
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, and one number!',
      },
    },
    profile: { type: Types.ObjectId, ref: 'Profile' },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>('save', function (next) {
  let user = this as IUser;

  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, 10, (error: Error, hash: string) => {
    if (error) return next(error);

    user.password = hash;
    next();
  });
});

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;
