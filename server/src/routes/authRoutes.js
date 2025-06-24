import express from 'express';
import { register } from '../controllers/auth/register.js';
import { login } from '../controllers/auth/login.js';
import { getMe } from '../controllers/auth/getMe.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { handleCreateChannel, listChannelsHandler } from '../controllers/auth/channelController.js';
import { viewChannelVolumes } from '../controllers/auth/volume.js';
import { createSpam, getSpamReports, removeSpamReport } from '../controllers/auth/spam.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { sendMessageHandler, getMessagesHandler } from '../controllers/auth/message.js';
import upload from '../services/auth/uploadService.js';
import { uploadFile } from '../controllers/auth/upload.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.post('/channels', handleCreateChannel);
router.get('/channels', listChannelsHandler);
router.get('/volume', viewChannelVolumes);
router.post('/report-spam', createSpam); // report spam
router.get('/spam-reports', getSpamReports); // list spam
router.delete('/spam-reports/:id', removeSpamReport); // delete spam
router.post('/messages', sendMessageHandler);
router.get('/messages/:channelId', getMessagesHandler);
router.post('/upload', upload.single('file'), uploadFile);

export default router;
