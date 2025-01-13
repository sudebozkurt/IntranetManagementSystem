const mysql = require('mysql2');

// Veritabanı bağlantısını oluştur
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Bozkurt.1905',
    database: 'IntranetSystem',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
