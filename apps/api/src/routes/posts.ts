import express from 'express';
import { getCategory } from './categories';
import { Post, Comment } from '../models/post';

const router = express.Router();

//init
const posts: Post[] = [];
const comments: Comment[] = [];

//get all posts
router.get('/', (req, res) => {
  res.status(200).json(posts);
});

//get by category
router.get('/category/:category', (req, res) => {
  const { category } = req.params;
  const categoryObj = getCategory(category);

  if (!categoryObj) {
    return res.status(404).json({ message: 'Category not found' });
  }

  const filteredPosts = posts.filter((p) => p.category === category);
  res.status(200).json(filteredPosts);
});

//get by id w category obj & comment objs
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const category = getCategory(post.category);
  const postComments = post.comments.map((commentId) => comments.find((c) => c.id === commentId)).filter((c): c is Comment => Boolean(c));

  res.status(200).json({ ...post, category, comments: postComments });
});

//create post
router.post('/', (req, res) => {
  const { title, image, description, category } = req.body;

  if (!title || !image || !description || !category) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const categoryObj = getCategory(category);
  if (!categoryObj) {
    return res.status(404).json({ message: 'Category not found' });
  }

  const newPost: Post = {
    id: Date.now().toString(),
    title,
    image,
    description,
    category,
    comments: []
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

//create comment inside post
router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;

  const post = posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (!author || !content) {
    return res.status(400).json({ message: 'Author and content are required.' });
  }

  const newComment: Comment = {
    id: Date.now().toString(),
    author,
    content
  };

  comments.push(newComment);
  post.comments.push(newComment.id);

  res.status(201).json(newComment);
});

//post update
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const { title, image, description, category } = req.body;

  if (category) {
    const categoryObj = getCategory(category);
    if (!categoryObj) {
      return res.status(404).json({ message: 'Category not found' });
    }
  }

  const updatedPost = { ...posts[postIndex] };
  if (title) updatedPost.title = title;
  if (image) updatedPost.image = image;
  if (description) updatedPost.description = description;
  if (category) updatedPost.category = category;

  posts[postIndex] = updatedPost;
  res.status(200).json(updatedPost);
});

//post delete
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const [deletedPost] = posts.splice(postIndex, 1);
  res.status(200).json(deletedPost);
});

export default router;
