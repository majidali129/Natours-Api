import express from 'express';
import {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  createUser,
} from '../controllers/user.controller.js';

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
export default router;
