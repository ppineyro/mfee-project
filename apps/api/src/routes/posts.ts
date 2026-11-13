import express from 'express';
import postController from '../controllers/post';

const router = express.Router();

//get all posts
router.get('/', postController.getPosts);

//get by category
router.get('/category/:category', postController.getPostsByCategory);

//get by id w category obj & comment objs
router.get('/:id', postController.getPostById);

//create post
router.post('/', postController.createPost);

//create comment inside post
router.post('/:id/comments', postController.createComment);

//post update
router.patch('/:id', postController.updatePost);

//post delete
router.delete('/:id', postController.deletePost);

export default router;
