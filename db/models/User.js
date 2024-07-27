import { Schema, model } from 'mongoose';

import { mongoSaveError, setMongoUpdateSettings } from './hooks.js';

const userSchema = new Schema(
  {
    avatarURL: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      //required: [true, 'Verify token is required'],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post('save', mongoSaveError);

userSchema.pre('findOneAndUpdate', setMongoUpdateSettings);

userSchema.post('findOneAndUpdate', mongoSaveError);

const User = model('user', userSchema);

export default User;
