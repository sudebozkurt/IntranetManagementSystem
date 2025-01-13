const db = require('../../config/dbConfig');

const authMiddleware = async (req, res, next) => {
    const sessionToken = req.cookies.sessionToken; // Çerezi oku

    if (!sessionToken) {
        return res.status(401).json({ message: 'Oturum bulunamadı. Lütfen giriş yapın.' });
    }

    try {
        // Oturum doğrulama
        const [sessions] = await db.execute('SELECT * FROM sessions WHERE session_token = ?', [sessionToken]);
        if (sessions.length === 0) {
            return res.status(401).json({ message: 'Geçersiz oturum. Lütfen giriş yapın.' });
        }

        // Kullanıcı verisini req'e ekle
        req.user = { id: sessions[0].user_id };
        next();
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};

module.exports = authMiddleware;
