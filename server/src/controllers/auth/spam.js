import {
  reportSpam,
  getAllSpamReports,
  deleteSpamReport
} from '../../services/auth/spamService.js';

export const createSpam = async (req, res) => {
  try {
    const { message_id, reported_by, reason } = req.body;
    const report = await reportSpam({ message_id, reported_by, reason });
    res.status(201).json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getSpamReports = async (req, res) => {
  try {
    const reports = await getAllSpamReports();
    res.status(200).json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const removeSpamReport = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteSpamReport(id);
    if (!success) return res.status(404).json({ success: false, message: 'Spam report not found' });

    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
