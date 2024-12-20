import express from 'express';
import upload from '../middleware/imageStorage.js';
const router = express.Router();

import {
    loginUser,
    registerUser,
    getUserProfile,
    updateUser,
} from '../controller/userControllers.js';


router.post('/login', loginUser);
router.post('/register', registerUser);
router.route('/:userId').get(getUserProfile).put(upload.single('profile_image'), updateUser);

export default router; 