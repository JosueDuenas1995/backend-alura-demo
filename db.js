// db.js
const mysql = require('mysql2');
require('dotenv').config(); // Esto es útil para desarrollo local, Cloud Run gestiona las variables de entorno por sí mismo.

// --- Importa el conector de Cloud SQL que instalaste ---
const { Connector } = require('@google-cloud/cloud-sql-connector'); // ¡Asegúrate que el nombre del módulo sea este!
const { Auth } = require('google-auth-library'); // Necesario para la autenticación automática con Google

// Aquí debes poner la cadena de conexión COMPLETA de tu instancia de Cloud SQL.
// La obtuvimos de los logs y de Terraform.
const CLOUD_SQL_CONNECTION_NAME = 'dark-throne-464103-h1:us-central1:aluradatabase-4e84c0355e9f129f';

// Crea una instancia del conector
// El conector usa las credenciales de la cuenta de servicio de Cloud Run automáticamente.
const auth = new Auth();
const connector = new Connector({ authClient: auth });

/**
 * Función asíncrona para establecer y devolver la conexión a la base de datos MySQL.
 * Esta función es la que tu aplicación principal debe llamar.
 * @returns {Promise<mysql.Connection>} Una promesa que resuelve con el objeto de conexión MySQL.
 */
async function connectToDatabase() {
  try {
    // El conector obtiene las opciones de conexión (incluyendo el socketPath correcto)
    // para MySQL2.
    // --- ¡CORRECCIÓN AQUÍ! Era 'connector.get and Connection', ahora es 'connector.getConnection' ---
    const clientOpts = await connector.getConnection(CLOUD_SQL_CONNECTION_NAME, 'mysql'); // 'mysql' es el tipo de base de datos

    // Crea la conexión MySQL usando las opciones del conector y tus credenciales
    const connection = mysql.createConnection({
      ...clientOpts, // Esto incluye el host (socketPath), user, password (si aplica internamente)
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Envuelve el método connect en una promesa para usar async/await
    await new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) return reject(err);
        console.log('🟢 Conexión a MySQL exitosa');
        resolve();
      });
    });

    return connection; // Retorna la conexión ya establecida
  } catch (err) {
    console.error('🔴 Error de conexión a MySQL:', err);
    // Vuelve a lanzar el error para que la aplicación principal sepa que hubo un fallo crítico.
    throw err;
  }
}

// Exporta la función de conexión.
// ¡Tu archivo principal (ej. app.js o index.js) DEBE llamar a esta función!
module.exports = connectToDatabase;

// --- NOTA IMPORTANTE PARA TU ARCHIVO PRINCIPAL (ej. app.js o index.js) ---
// Antes de este cambio, probablemente estabas haciendo algo como:
// const connection = require('./db');
//
// AHORA, tu archivo principal debe manejar la conexión de forma asíncrona.
// Ejemplo:
/*
const express = require('express');
const connectToDatabase = require('./db'); // Importa la función

const app = express();
const PORT = process.env.PORT || 8080; // Cloud Run usa PORT 8080 por defecto

let dbConnection; // Declara una variable para almacenar la conexión a la DB

// Inicia la aplicación SOLO DESPUÉS de establecer la conexión a la base de datos
connectToDatabase()
  .then(conn => {
    dbConnection = conn; // Almacena la conexión exitosa
    console.log('Aplicación conectada a la base de datos. Iniciando servidor...');

    // Puedes pasar la conexión a tus rutas o controladores aquí si es necesario
    app.use((req, res, next) => {
      req.db = dbConnection; // O una pool, si usas pool de conexiones
      next();
    });

    // Definir tus rutas de Express aquí
    app.get('/', (req, res) => {
      res.send('Backend de Alura funcionando y conectado a DB!');
    });

    app.get('/usuarios', async (req, res) => {
      try {
        const [rows] = await dbConnection.promise().query('SELECT * FROM usuarios');
        res.json(rows);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('Error al obtener usuarios.');
      }
    });

    // Inicia el servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor Express escuchando en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('🔴 Error fatal: No se pudo iniciar la aplicación debido a la conexión a la DB:', err);
    process.exit(1); // Sale del proceso si no se puede conectar a la DB
  });
*/