const bcrypt = require('bcrypt');
const db = require('../../config/dbConfig');

exports.addUser = async (req, res) => {
    const { name, email, role, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute('CALL AddUser(?, ?, ?, ?)', [name, email, hashedPassword, role]);
        res.status(201).json({ message: 'Kullanıcı başarıyla eklendi.', userId: result.insertId });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Kullanıcı eklenemedi.' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const [rows] = await db.execute('CALL GetUsers()');
        res.status(200).json(rows[0] || []);
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Kullanıcılar alınamadı.' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
        const [result] = await db.execute('CALL UpdateUser(?, ?, ?, ?)', [id, name, email, role]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Kullanıcı başarıyla güncellendi.' });
        } else {
            res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Kullanıcı güncellenemedi.' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.execute('CALL DeleteUser(?)', [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Kullanıcı başarıyla silindi.' });
        } else {
            res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Kullanıcı silinemedi.' });
    }
};