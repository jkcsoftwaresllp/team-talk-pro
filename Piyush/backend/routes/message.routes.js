import express, { Router } from 'express';
import { body, validationResult } from 'express-validator';
import messageModel from '../models/message.model.js';

const router = Router();

router.post(
  '/send',
  [
    body('sender_id').isInt().withMessage('Sender ID must be an integer'),
    body('receiver_id').isInt().withMessage('Receiver ID must be an integer'),
    body('text').optional().isString(),
    body('image').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid message data'
      });
    }

    const { sender_id, receiver_id, text, image } = req.body;

    try {
      const messageId = await messageModel.createMessage({
        sender_id,
        receiver_id,
        text,
        image
      });

      res.status(201).json({
        message: 'Message sent',
        messageId
      });
    } catch (err) {
      console.error('Send error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get('/history/:sender_id/:receiver_id', async (req, res) => {
  const { sender_id, receiver_id } = req.params;

  try {
    const messages = await messageModel.getMessageHistory(
      parseInt(sender_id), 
      parseInt(receiver_id)
    );
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
