import { Router } from 'express';
import { WorkshopController } from '../controllers/workshopController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All workshop routes require authentication
router.use(authMiddleware);

router.post('/', WorkshopController.create);
router.get('/', WorkshopController.getAll);
router.get('/:id', WorkshopController.getById);
router.put('/:id', WorkshopController.update);
router.delete('/:id', WorkshopController.delete);

export default router;
