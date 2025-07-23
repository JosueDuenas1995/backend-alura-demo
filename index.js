// index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config(); // Para variables de entorno en desarrollo local

// --- Importa la función de conexión a la base de datos ---
// ¡IMPORTANTE! Asegúrate que el require apunte al nombre correcto del archivo db.js
// y que el módulo que exporta db.js sea la función connectToDatabase
const connectToDatabase = require('./db'); 

const app = express();
const contactosRoutes = require('./routes/contactos'); // Asegúrate que la ruta sea correcta

app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

// Rutas (pueden necesitar la conexión a la DB, la pasaremos más abajo)
app.use('/api/contactos', contactosRoutes);

// --- Iniciar servidor (MODIFICADO para esperar la conexión a la DB) ---
// Cloud Run inyectará la variable de entorno PORT.
// Tu aplicación debe escuchar en este puerto.
const PORT = process.env.PORT || 8080; 

let dbConnection; // Variable para almacenar la conexión a la base de datos

// Esta es la parte CRÍTICA: Conecta a la DB y luego inicia el servidor
connectToDatabase()
  .then(conn => {
    dbConnection = conn; // Almacena la conexión exitosa
    console.log('🟢 Aplicación conectada a la base de datos. Iniciando servidor Express...');

    // --- IMPORTANTE: Cómo pasar la conexión a tus rutas ---
    // Si tus rutas en 'contactosRoutes' necesitan la conexión a la base de datos (dbConnection),
    // deberás modificar cómo las usas. La forma más sencilla es usar un middleware:
    app.use((req, res, next) => {
      req.db = dbConnection; // Ahora puedes acceder a la conexión con req.db en tus rutas
      next();
    });
    // Si tus rutas ya están definidas en contactosRoutes y no usan req.db,
    // asegúrate de que no intenten acceder a la DB antes de que la conexión esté lista.

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