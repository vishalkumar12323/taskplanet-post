import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
  },
  { timestamps: true }
);

postSchema.methods.toFeedItem = function () {
  return {
    id: this._id,
    author: this.author && typeof this.author.toPublicProfile === 'function'
      ? this.author.toPublicProfile()
      : (this.author && this.author._id ? {
          id: this.author._id,
          name: this.author.name,
          email: this.author.email,
          avatarUrl: this.author.avatarUrl,
        } : this.author),
    text: this.text,
    imageUrl: this.imageUrl,
    likesCount: this.likes.length,
    commentsCount: this.comments.length,
    likedBy: this.likes.map(id => id.toString ? id.toString() : id),
    createdAt: this.createdAt,
  };
};

const Post = mongoose.model("Post", postSchema);

export default Post;

