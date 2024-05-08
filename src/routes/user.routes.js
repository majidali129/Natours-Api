import express from 'express';
import {
  getAllUsers,
  updateUser,
  updateMe,
  deleteMe,
  deleteUser,
  getUser,
  getMe,
  createUser
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
import { restrectRoute } from '../middlewares/restrictRouteByRole.js';

const router = express.Router();

// SPECIAL ROUTES FOR AUTHENTICATION
router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
// ------------------------
router.use(protectRoute);
// Responsible to protect routes next to it
router.patch('/updatePassword', updatePassword);
// ------------------------
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);
// ------------------------

router.use(restrectRoute('admin'));
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
export default router;
