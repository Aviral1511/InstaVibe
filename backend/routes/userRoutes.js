import express from 'express';
import { editProfile, followOrUnfollow, getProfile, getSuggestedUser, login, logOut, register } from '../controllers/userController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.get('/logout', logOut);
router.get('/:id/profile', isAuthenticated , getProfile);
router.post('/profile/edit',isAuthenticated, upload.single('profilePicture'), editProfile);
router.get('/suggested', isAuthenticated , getSuggestedUser);
router.post('/followOrUnfollow/:id', isAuthenticated , followOrUnfollow);

export default router;