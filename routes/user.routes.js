import express from 'express';
import {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  createUser,
} from '../controllers/user.controller.js';
import { checkId } from '../controllers/tour.controller.js';

const router = express.Router();

router.param('id', checkId);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
export default router;
