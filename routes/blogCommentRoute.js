/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Blog comments and replies
 */

/**
 * @swagger
 * /api/v1/comments/{blogId}:
 *   get:
 *     summary: Get all comments for a blog post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Array of comments
 */

/**
 * @swagger
 * /api/v1/comments:
 *   post:
 *     summary: Create a new comment on a blog post
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [blogId, content, userName, email]
 *             properties:
 *               blogId: { type: string }
 *               content: { type: string }
 *               userName: { type: string }
 *               email: { type: string }
 *               website: { type: string }
 *     responses:
 *       201:
 *         description: Comment created
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/v1/comments/{id}:
 *   delete:
 *     summary: Delete a comment and its replies (admin only)
 *     tags: [Comments]
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comment and replies deleted
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /api/v1/replies/{commentId}:
 *   get:
 *     summary: Get all replies for a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Array of replies
 */

/**
 * @swagger
 * /api/v1/replies:
 *   post:
 *     summary: Create a reply to a comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [blogId, commentId, content, userName, email]
 *             properties:
 *               blogId: { type: string }
 *               commentId: { type: string }
 *               content: { type: string }
 *               userName: { type: string }
 *               email: { type: string }
 *               website: { type: string }
 *     responses:
 *       201:
 *         description: Reply created
 */

/**
 * @swagger
 * /api/v1/replies/{id}:
 *   delete:
 *     summary: Delete a reply (admin only)
 *     tags: [Comments]
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Reply deleted
 *       404:
 *         description: Reply not found
 */
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Comment = require('../model/blogCommentModel');
const Reply = require('../model/blogReplyModel');
const Blog = require('../model/blogModel');
const {verifyToken} = require('../middleware/Admin');

// Public, unauthenticated write endpoints — cap at 5 posts per 5 minutes per IP
// to block scripted comment spam while still allowing a real back-and-forth.
const commentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: { message: "Too many comments from this address. Please slow down and try again shortly." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Get every comment across every blog post, for the admin dashboard —
// enriched with the blog's title/slug and a reply count per comment.
// Registered before /comments/:blogId so "admin" is never treated as a blogId.
router.get('/comments/admin/all', verifyToken, async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }).lean();

    const blogIds = [...new Set(comments.map((c) => c.blogId))];
    const blogs = await Blog.find({ _id: { $in: blogIds } }, 'title slug').lean();
    const blogMap = Object.fromEntries(blogs.map((b) => [String(b._id), b]));

    const commentIds = comments.map((c) => c._id);
    const replyCounts = await Reply.aggregate([
      { $match: { commentId: { $in: commentIds.map(String) } } },
      { $group: { _id: '$commentId', count: { $sum: 1 } } },
    ]);
    const replyCountMap = Object.fromEntries(replyCounts.map((r) => [r._id, r.count]));

    const enriched = comments.map((c) => ({
      ...c,
      blogTitle: blogMap[c.blogId]?.title || 'Deleted post',
      blogSlug: blogMap[c.blogId]?.slug || null,
      replyCount: replyCountMap[String(c._id)] || 0,
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin reply — posted from the dashboard, uses the logged-in admin's own
// name/email (not client-supplied) and is flagged isAdmin for the public page.
router.post('/replies/admin', verifyToken, async (req, res) => {
  const { blogId, commentId, content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Content cannot be empty' });
  }
  if (!blogId || !commentId) {
    return res.status(400).json({ message: 'blogId and commentId are required' });
  }

  try {
    const newReply = new Reply({
      blogId,
      commentId,
      content,
      userName: req.user.name || 'Elonatech Team',
      email: req.user.email,
      isAdmin: true,
    });
    await newReply.save();
    res.status(201).json(newReply);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get comments for a specific blog post
router.get('/comments/:blogId', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Create a new comment
router.post('/comments', commentLimiter, async (req, res) => {
  const { blogId, content, userName, email, website, createdAt } = req.body;

  // Basic validation for emoji/text content
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Content cannot be empty' });
  }

  if (!userName || userName.trim().length === 0) {
    return res.status(400).json({ message: 'Name is required' });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'A valid email is required' });
  }

  const newComment = new Comment({
    blogId,
    content,
    userName,
    email,
    website,
    createdAt
  });

  try {
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a comment
router.delete('/comments/:id', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await Reply.deleteMany({ commentId: req.params.id });
    await comment.deleteOne();
    res.json({ message: 'Comment and associated replies deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get replies for a specific comment
router.get('/replies/:commentId', async (req, res) => {
  try {
    const replies = await Reply.find({ commentId: req.params.commentId })
      .sort({ createdAt: -1 });
    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new reply
router.post('/replies', commentLimiter, async (req, res) => {
  const { blogId, commentId, content, userName, email, website, createdAt } = req.body;

  // Basic validation for emoji/text content
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Content cannot be empty' });
  }

  if (!userName || userName.trim().length === 0) {
    return res.status(400).json({ message: 'Name is required' });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'A valid email is required' });
  }

  const newReply = new Reply({
    blogId,
    commentId,
    content,
    userName,
    email,
    website,
    createdAt
  });

  try {
    await newReply.save();
    res.status(201).json(newReply);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a reply
router.delete('/replies/:id', verifyToken, async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    await reply.deleteOne();
    res.json({ message: 'Reply deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
