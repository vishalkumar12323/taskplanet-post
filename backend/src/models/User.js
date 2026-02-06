import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.toPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatarUrl: this.avatarUrl,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model("User", userSchema);

export default User;

