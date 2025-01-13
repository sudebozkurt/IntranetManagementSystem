const pool = require('../../config/dbConfig');

// Tüm etkinlikleri listele
const getAllEvents = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM events ORDER BY date DESC');
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Etkinlikler alınamadı.' });
    }
};

// Yeni etkinlik oluştur
const createEvent = async (req, res) => {
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }

    try {
        await pool.query('INSERT INTO events (title, description, date) VALUES (?, ?, ?)', [title, description, date]);
        res.status(201).json({ message: 'Etkinlik başarıyla oluşturuldu.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Etkinlik oluşturulamadı.' });
    }
};

// Etkinliği güncelle
const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, date } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE events SET title = ?, description = ?, date = ? WHERE event_id = ?',
            [title, description, date, id]
        );
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Etkinlik başarıyla güncellendi.' });
        } else {
            res.status(404).json({ message: 'Etkinlik bulunamadı.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Etkinlik güncellenemedi.' });
    }
};

// Etkinliği sil
const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM events WHERE event_id = ?', [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Etkinlik başarıyla silindi.' });
        } else {
            res.status(404).json({ message: 'Etkinlik bulunamadı.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Etkinlik silinemedi.' });
    }
};

module.exports = {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};
