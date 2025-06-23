import { Router } from 'express';
import { createGroupController } from '../controllers/chat/createGroup.controller.js';
// future: import createOneToOneController

const router = Router();

router.post('/group', createGroupController);
// router.post('/one-to-one', createOneToOneController);

export default router;
