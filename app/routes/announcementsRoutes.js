const express = require('express');
const { getAnnouncements, addAnnouncement, deleteAnnouncement, updateAnnouncement, getAllAnnouncements } = require('../controllers/announcementsController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getAnnouncements); // Tüm duyuruları getir
router.post('/', authMiddleware, addAnnouncement); // Yeni duyuru ekle
router.put('/:announcement_id', authMiddleware, updateAnnouncement); // Güncelleme
router.delete('/:announcement_id', authMiddleware, deleteAnnouncement); // Silme
router.get('/all-announcements', authMiddleware, getAllAnnouncements);

module.exports = router;
