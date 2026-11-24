import Category from '../models/category';
import { Post, Comment } from '../models/post';

//get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('category').populate('comments');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get by category
const getPostsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const categoryObj = await Category.findById(category);
    if (!categoryObj) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const filteredPosts = await Post.find({ category }).populate('category').populate('comments');
    res.status(200).json(filteredPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get by id w category obj & comment objs
const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate('category').populate('comments');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create post
const createPost = async (req, res) => {
  const { title, image, description, category } = req.body;

  if (!title || !image || !description || !category) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const categoryObj = await Category.findById(category);
    if (!categoryObj) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const newPost = await Post.create({
      title,
      image,
      description,
      category
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create comment inside post
const createComment = async (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = await Comment.create({ author, content });
    post.comments.push(newComment._id);
    await post.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//post update
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, image, description, category } = req.body;

  try {
    if (category) {
      const categoryObj = await Category.findById(category);
      if (!categoryObj) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(id, { title, image, description, category }, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//post delete
const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    //delete associated comments
    await Comment.deleteMany({ _id: { $in: post.comments } });

    //delete post
    await Post.findByIdAndDelete(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getPosts,
  getPostsByCategory,
  getPostById,
  createPost,
  createComment,
  updatePost,
  deletePost
};
