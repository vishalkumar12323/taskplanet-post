import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Post from "../models/Post.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// Configure multer storage for images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// GET /api/posts - public feed with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({})
        .populate("author")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments({}),
    ]);

    const items = posts.map((p) => p.toFeedItem());

    return res.json({
      items,
      page,
      total,
      hasMore: skip + posts.length < total,
    });
  } catch (err) {
    console.error("Get posts error:", err);
    return res.status(500).json({ message: "Failed to load posts." });
  }
});

// POST /api/posts - create post (text, image or both)
router.post("/", authRequired, upload.single("image"), async (req, res) => {
  try {
    const { text } = req.body;
    const file = req.file;

    if (!text && !file) {
      return res.status(400).json({
        message: "Either text or image is required.",
      });
    }

    let imageUrl;
    if (file) {
      imageUrl = `/uploads/${file.filename}`;
    }

    const post = await Post.create({
      author: req.user._id,
      text: text || "",
      imageUrl,
    });

    await post.populate("author");

    return res.status(201).json({ post: post.toFeedItem() });
  } catch (err) {
    console.error("Create post error:", err);
    return res.status(500).json({ message: "Failed to create post." });
  }
});

// POST /api/posts/:id/like - toggle like
router.post("/:id/like", authRequired, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const userId = req.user._id;
    const hasLiked = post.likes.some((id) => id.toString() === userId.toString());

    if (hasLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();
    await post.populate("author");

    return res.json({ post: post.toFeedItem() });
  } catch (err) {
    console.error("Like post error:", err);
    return res.status(500).json({ message: "Failed to like post." });
  }
});

// POST /api/posts/:id/comments - add comment
router.post("/:id/comments", authRequired, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.comments.push({
      author: req.user._id,
      text: text.trim(),
    });

    await post.save();
    await post.populate("author");

    return res.status(201).json({ post: post.toFeedItem() });
  } catch (err) {
    console.error("Comment error:", err);
    return res.status(500).json({ message: "Failed to comment on post." });
  }
});

export default router;

