import express from 'express';
import {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser
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
// -----------------
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protectRoute, updatePassword);
// -----------------------------
// router.route('/').get(getAllUsers);
// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
export default router;
