const pool = require('../../config/dbConfig');

// Tüm izin taleplerini listele
const getAllLeaves = async (req, res) => {
    try {
        const [results] = await pool.query('CALL GetLeaveRequests()');
        res.status(200).json(results[0] || []);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'İzin talepleri alınamadı.' });
    }
};

// Yeni izin talebi oluştur
const createLeave = async (req, res) => {
    const { user_id, start_date, end_date, reason } = req.body;

    if (!user_id || !start_date || !end_date || !reason) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }

    try {
        await pool.query('CALL AddLeaveRequest(?, ?, ?, ?)', [user_id, reason, start_date, end_date]);

        res.status(201).json({ message: 'İzin talebi başarıyla oluşturuldu.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'İzin talebi oluşturulamadı.' });
    }
};

// İzin talebinin durumunu güncelle
const updateLeaveStatus = async (req, res) => {
    const { leave_id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Geçerli bir durum belirtin.' });
    }

    try {
        await pool.query('CALL UpdateLeaveStatus(?, ?)', [leave_id, status]);
        res.status(200).json({ message: 'İzin talebi durumu güncellendi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'İzin talebi durumu güncellenemedi.' });
    }
};

// İzin talebini sil
const deleteLeave = async (req, res) => {
    const { leave_id } = req.params;

    try {
        await pool.query('CALL DeleteLeaveRequest(?)', [leave_id]);
        res.status(200).json({ message: 'İzin talebi başarıyla silindi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'İzin talebi silinemedi.' });
    }
};

// İzin talebini güncelle
const updateLeave = async (req, res) => {
    const { leave_id } = req.params;
    const { start_date, end_date, reason } = req.body;

    if (!start_date || !end_date || !reason) {
        return res.status(400).json({ message: 'Tüm alanları doldurun.' });
    }

    try {
        const [result] = await pool.query('CALL UpdateLeaveRequest(?, ?, ?, ?)', [leave_id, start_date, end_date, reason]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'İzin talebi başarıyla güncellendi.' });
        } else {
            res.status(404).json({ message: 'İzin talebi bulunamadı.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'İzin talebi güncellenemedi.' });
    }
};


module.exports = {
    getAllLeaves,
    createLeave,
    updateLeaveStatus,
    deleteLeave, updateLeave
};
