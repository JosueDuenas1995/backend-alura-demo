// db.js
const mysql = require('mysql2/promise');

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // IP pública de tu instancia
  user: process.env.DB_USER,         // Usuario de la DB (ej: alura)
  password: process.env.DB_PASSWORD, // Contraseña de la DB
  database: process.env.DB_NAME,     // Nombre de la base de datos (ej: contactos_db)
  waitForConnections: true,
  connectionLimit: 10,  // Puedes ajustar este valor si tu backend escala
  queueLimit: 0
});

module.exports = pool;
