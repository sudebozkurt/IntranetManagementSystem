const express = require('express');
const { 
    getAllLeaves, 
    createLeave, 
    updateLeaveStatus, 
    deleteLeave,
    updateLeave
} = require('../controllers/leaveController');

const router = express.Router();

// Tüm izin taleplerini getir
router.get('/', getAllLeaves);

// Yeni izin talebi oluştur
router.post('/', createLeave);

// İzin talebinin durumunu güncelle
router.put('/:leave_id/status', updateLeaveStatus);

// İzin talebini sil
router.delete('/:leave_id', deleteLeave);

router.put('/:leave_id', updateLeave);

module.exports = router;
