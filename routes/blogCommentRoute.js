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
 *             required: [blogId, content, userName, gender]
 *             properties:
 *               blogId: { type: string }
 *               content: { type: string }
 *               userName: { type: string }
 *               gender:
 *                 type: string
 *                 enum: [male, female]
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
 *             required: [blogId, commentId, content, userName, gender]
 *             properties:
 *               blogId: { type: string }
 *               commentId: { type: string }
 *               content: { type: string }
 *               userName: { type: string }
 *               gender:
 *                 type: string
 *                 enum: [male, female]
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
const Comment = require('../model/blogCommentModel');
const Reply = require('../model/blogReplyModel');
const {verifyToken} = require('../middleware/Admin');

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

// Create a new comment
router.post('/comments', async (req, res) => {
  const { blogId, content, userName, gender, createdAt } = req.body;

  // Basic validation for emoji/text content
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Content cannot be empty' });
  }

  // Validate gender
  if (!['male', 'female'].includes(gender)) {
    return res.status(400).json({ message: 'Gender must be either male or female' });
  }

  const newComment = new Comment({
    blogId,
    content,
    userName,
    gender,
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
router.post('/replies', async (req, res) => {
  const { blogId, commentId, content, userName, gender, createdAt } = req.body;

  // Basic validation for emoji/text content
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Content cannot be empty' });
  }

  // Validate gender
  if (!['male', 'female'].includes(gender)) {
    return res.status(400).json({ message: 'Gender must be either male or female' });
  }

  const newReply = new Reply({
    blogId,
    commentId,
    content,
    userName,
    gender,
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
