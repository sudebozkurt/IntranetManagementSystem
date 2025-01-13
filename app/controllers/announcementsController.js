const db = require('../../config/dbConfig');

const addAnnouncement = async (req, res) => {
    const { title, description, created_by } = req.body;

    if (!title || !description || !created_by) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }

    try {
        const [result] = await db.execute('CALL AddAnnouncement(?, ?, ?)', [title, description, created_by]);
        res.status(201).json({ message: 'Duyuru başarıyla eklendi.', announcementId: result.insertId });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Duyuru eklenemedi.' });
    }
};

const getAnnouncements = async (req, res) => {
    try {
        const [results] = await db.execute('CALL GetAnnouncements()');
        res.status(200).json(results[0] || []);
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Duyurular alınamadı.' });
    }
};


const updateAnnouncement = async (req, res) => {
    const { announcement_id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }

    try {
        const [result] = await db.execute('CALL UpdateAnnouncement(?, ?, ?)', [announcement_id, title, description]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Duyuru bulunamadı.' });
        }

        res.status(200).json({ message: 'Duyuru başarıyla güncellendi.' });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Duyuru güncellenemedi.' });
    }
};

const deleteAnnouncement = async (req, res) => {
    const { announcement_id } = req.params;

    try {
        const [result] = await db.execute('CALL DeleteAnnouncement(?)', [announcement_id]);


        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Duyuru bulunamadı.' });
        }

        res.status(200).json({ message: 'Duyuru başarıyla silindi.' });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Duyuru silinemedi.' });
    }
};
const getAllAnnouncements = async (req, res) => {
    try {
        const [announcements] = await db.execute('CALL GetAllAnnouncements()');
        res.status(200).json(announcements);
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Duyurular alınamadı.' });
    }
};

module.exports = { addAnnouncement, getAnnouncements,updateAnnouncement, deleteAnnouncement, getAllAnnouncements };
