import { Hono } from 'hono';
import {
  createPosition,
  updatePosition,
  getPosition,
  getHierarchy,
  getChildren,
  deletePosition,
} from '../controllers/position';

const router = new Hono();

router.post('/', createPosition);
router.get('/hierarchy', getHierarchy);
router.put('/:id', updatePosition);
router.get('/:id', getPosition);
router.get('/:id/children', getChildren);
router.delete('/:id', deletePosition);

export default router;