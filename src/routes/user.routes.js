import express from 'express';
import {
  getAllUsers,
  updateUser,
  updateMe,
  deleteMe,
  deleteUser,
  getUser,
  getMe
  // createUser
} from '../controllers/user.controller.js';
import {
  forgotPassword,
  logIn,
  resetPassword,
  signUp,
  updatePassword
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

// SPECIAL ROUTES FOR AUTHENTICATION ;  AS IT IS A SEPARATE RESOURCE
router.post('/signup', signUp);
router.post('/login', logIn);
// ------------------------
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protectRoute, updatePassword);
// ------------------------
router.get('/me', protectRoute, getMe, getUser);
router.patch('/updateMe', protectRoute, updateMe);
router.delete('/deleteMe', protectRoute, deleteMe);
// ------------------------
router.route('/').get(getAllUsers);
router.route('/:id').patch(updateUser).delete(deleteUser);
export default router;
