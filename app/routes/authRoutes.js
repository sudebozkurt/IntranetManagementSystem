const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require('../../config/dbConfig');
const {login, getUserInfo, logout, getUserIdFromToken} = require('../controllers/authController');

router.post('/login', login);
router.get('/user-info', getUserInfo);
router.post('/logout', logout);
router.get('/user-id', getUserIdFromToken);

module.exports = router;