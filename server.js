const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PORT } = require('./config/serverConfig');
const userRoutes = require('./app/routes/userRoutes');
const authRoutes = require('./app/routes/authRoutes');
const authMiddleware = require('./app/middlewares/authMiddleware');
const leaveRoutes = require('./app/routes/leaveRoutes');
const announcementRoutes = require('./app/routes/announcementsRoutes');
const salaryRoutes = require('./app/routes/salaryRoutes');
const eventRoutes = require('./app/routes/eventRoutes');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());


// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/events', eventRoutes);



// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'index.html'));
});

// Korumalı rotalar (authMiddleware ile korunuyor)
app.get('/admin', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'admin.html'));
});
app.get('/dashboard', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'dashboard.html'));
});
app.get('/announcements', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'announcements.html'));
});
app.get('/event', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'event.html'));
});
app.get('/leave', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'leave.html'));
});
app.get('/salary', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'salary.html'));
});
app.get('/users', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html', 'users.html'));
});

// Server başlatma
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
