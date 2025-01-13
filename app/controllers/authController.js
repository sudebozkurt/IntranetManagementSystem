const bcrypt = require('bcrypt');
const db = require('../../config/dbConfig'); // dbConfig doğru şekilde içe aktarılmalı

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kullanıcı doğrulama
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Geçersiz email veya şifre.' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Geçersiz email veya şifre.' });
        }

        // Session oluşturma
        const sessionToken = `${user.user_id}-${Date.now()}`;
        await db.execute(
            'INSERT INTO sessions (session_token, user_id, created_at) VALUES (?, ?, NOW())',
            [sessionToken, user.user_id]
        );

        // Çereze sessionToken ekle
        res.cookie('sessionToken', sessionToken, {
            httpOnly: false, // JavaScript erişimini engelle
            secure: false, // HTTPS üzerinde true yapılmalı
            maxAge: 24 * 60 * 60 * 1000, // 24 saat
        });

        // Role'e göre yönlendirme
        const redirectUrl = user.role === 'Admin' ? '/admin' : '/dashboard';
        res.json({ message: 'Giriş başarılı.', redirectUrl });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};

exports.getUserInfo = async (req, res) => {
    const sessionToken = req.cookies ? req.cookies.sessionToken : null;

    if (!sessionToken) {
        return res.status(401).json({ message: 'Oturum bulunamadı.' });
    }

    try {
        // Session'dan user_id'yi bul
        const [sessions] = await db.execute('SELECT user_id FROM sessions WHERE session_token = ?', [sessionToken]);
        if (sessions.length === 0) {
            return res.status(401).json({ message: 'Geçersiz oturum.' });
        }

        const userId = sessions[0].user_id;

        // Kullanıcı bilgilerini al
        const [users] = await db.execute('SELECT name FROM users WHERE user_id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        res.json({ name: users[0].name });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};

exports.logout = async (req, res) => {
    const sessionToken = req.cookies ? req.cookies.sessionToken : null;

    if (!sessionToken) {
        return res.status(400).json({ message: 'Çıkış yapılacak oturum bulunamadı.' });
    }

    try {
        // Oturumu veritabanından sil
        await db.execute('DELETE FROM sessions WHERE session_token = ?', [sessionToken]);

        // Çerezi temizle
        res.clearCookie('sessionToken', {
            httpOnly: true,
            secure: false, // HTTPS üzerinde true yapılmalı
            sameSite: 'strict',
        });

        res.json({ message: 'Başarıyla çıkış yapıldı.' });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};

exports.getUserIdFromToken = async (req, res) => {
    const sessionToken = req.cookies ? req.cookies.sessionToken : null;

    if (!sessionToken) {
        return res.status(401).json({ message: 'Oturum bulunamadı.' });
    }

    try {
        // Token'dan user_id'yi al
        const [sessions] = await db.execute(
            'SELECT user_id FROM sessions WHERE session_token = ?',
            [sessionToken]
        );

        if (sessions.length === 0) {
            return res.status(401).json({ message: 'Geçersiz oturum.' });
        }

        res.status(200).json({ user_id: sessions[0].user_id });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};


