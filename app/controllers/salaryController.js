const db = require('../../config/dbConfig');

exports.getSalaries = async (req, res) => {
    try {
        const [rows] = await db.execute('CALL GetSalaries()');
        res.status(200).json(rows[0] || []);
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Maaş bilgileri alınamadı.' });
    }
};


exports.addSalary = async (req, res) => {
    const { user_id, salaryAmount, paymentDate } = req.body;

    try {
        await db.execute('CALL AddSalary(?, ?, ?)', [user_id, salaryAmount, paymentDate]);
        res.status(201).json({ message: 'Maaş bilgisi başarıyla eklendi.' });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Maaş bilgisi eklenemedi.' });
    }
};

exports.updateSalary = async (req, res) => {
    const { salary_id } = req.params;
    const { salary_amount } = req.body;

    if (!salary_amount) {
        return res.status(400).json({ message: 'Yeni maaş miktarını belirtin.' });
    }

    try {
        const [result] = await db.execute('CALL UpdateSalary(?, ?)', [salary_id, salary_amount]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Maaş başarıyla güncellendi.' });
        } else {
            res.status(404).json({ message: 'Maaş bilgisi bulunamadı.' });
        }
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Maaş güncellenemedi.' });
    }
};

exports.getSalaryByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const [results] = await db.execute('CALL GetSalaryByUserId(?)', [userId]);
        const salaryData = results[0]; // İlk veri kümesini alın
        if (salaryData.length > 0) {
            res.status(200).json(salaryData[0]); // İlk kaydı döndürün
        } else {
            res.status(404).json({ message: 'Maaş bilgisi bulunamadı.' });
        }
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Maaş bilgisi alınamadı.' });
    }
};

