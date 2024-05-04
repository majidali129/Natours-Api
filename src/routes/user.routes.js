import express from 'express';
import {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  // createUser
} from '../controllers/user.controller.js';
import {logIn, signUp } from '../controllers/auth.controller.js';

const router = express.Router();

// SPECIAL ROUTES FOR AUTHENTICATION ;  AS IT IS A SEPARATE RESOURCE
router.post('/signup', signUp)
router.post('/login', logIn)
// -----------------------------
// router.route('/').get(getAllUsers);
// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
export default router;
