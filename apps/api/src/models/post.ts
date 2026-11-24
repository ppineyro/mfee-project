import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  author: string;
  content: string;
}

export interface IPost extends Document {
  title: string;
  image: string;
  description: string;
  category: Schema.Types.ObjectId;
  comments: Schema.Types.ObjectId[];
}

export const commentSchema = new Schema<IComment>(
  {
    author: {
      type: String,
      required: [true, 'Property is required'],
    },
    content: {
      type: String,
      required: [true, 'Property is required'],
    },
  },
  {
    timestamps: true,
  }
);

export const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Property is required'],
    },
    image: {
      type: String,
      required: [true, 'Property is required'],
    },
    description: {
      type: String,
      required: [true, 'Property is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Property is required'],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model<IComment>('Comment', commentSchema);
const Post = mongoose.model<IPost>('Post', postSchema);

export { Post, Comment };
