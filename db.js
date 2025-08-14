// db.js (extracto)
const mysql = require('mysql2/promise');

function getConfig() {
  if (process.env.INSTANCE_CONNECTION_NAME) {
    return {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
    };
  }
  // fallback IP pública (local/VM)
  return {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

module.exports = mysql.createPool({
  ...getConfig(),
  waitForConnections: true,
  connectionLimit: 10,
});