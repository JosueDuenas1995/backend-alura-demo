// index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config(); // Para variables de entorno en desarrollo local

// --- Importa la función de conexión a la base de datos ---
const connectToDatabase = require('./db'); // Asegúrate que la ruta sea correcta

const app = express();
const contactosRoutes = require('./routes/contactos');

app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

// Rutas (pueden necesitar la conexión a la DB, la pasaremos más abajo)
app.use('/api/contactos', contactosRoutes);

// --- Iniciar servidor (MODIFICADO para esperar la conexión a la DB) ---
const PORT = process.env.PORT || 8080; // Cloud Run inyectará PORT (ej. 3000)

let dbConnection; // Variable para almacenar la conexión a la base de datos

// Esta es la parte CRÍTICA: Conecta a la DB y luego inicia el servidor
connectToDatabase()
  .then(conn => {
    dbConnection = conn; // Almacena la conexión exitosa
    console.log('🟢 Aplicación conectada a la base de datos. Iniciando servidor Express...');

    // Opcional: Puedes pasar la conexión a tus rutas o controladores si la necesitan
    // Por ejemplo, si contactosRoutes necesita la conexión:
    // contactosRoutes.setDbConnection(dbConnection); // Necesitarías crear este método en contactosRoutes

    // Inicia el servidor Express SOLAMENTE DESPUÉS de que la DB esté conectada
    app.listen(PORT, '0.0.0.0', () => { // Escucha en 0.0.0.0 para todas las interfaces
      console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    // Si la conexión a la DB falla, registra el error y termina el proceso
    console.error('🔴 Error fatal: No se pudo iniciar la aplicación debido a la conexión a la DB:', err);
    process.exit(1); // Termina el proceso con un código de error
  });

// --- NOTA IMPORTANTE para tus rutas (contactosRoutes) ---
// Si tus rutas en 'contactosRoutes' necesitan la conexión a la base de datos (dbConnection),
// deberás modificar cómo las usas. Hay varias formas:
// 1. Pasarla como argumento: module.exports = (db) => { ... rutas ... };
//    Y en index.js: app.use('/api/contactos', contactosRoutes(dbConnection));
// 2. Usar un middleware: app.use((req, res, next) => { req.db = dbConnection; next(); });
//    Y en tus rutas: req.db.query(...)
// 3. Crear un pool de conexiones global (más recomendado para apps grandes).
//nueva actualizacionde prueba
//intento de prueba 