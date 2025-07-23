// index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config(); // Para variables de entorno en desarrollo local

// --- NO IMPORTAMOS LA FUNCIÓN DE CONEXIÓN A LA DB POR AHORA ---
// const connectToDatabase = require('./db'); 

const app = express();
const contactosRoutes = require('./routes/contactos');

app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

// Rutas (¡ADVERTENCIA!: Las rutas que necesiten la DB fallarán)
app.use('/api/contactos', contactosRoutes);

// --- Iniciar servidor (MODIFICADO para ignorar la conexión a la DB) ---
const PORT = process.env.PORT || 8080; 

// Ya no necesitamos dbConnection aquí si no vamos a conectar al inicio.
// let dbConnection; 

// Iniciamos el servidor Express DIRECTAMENTE
app.listen(PORT, '0.0.0.0', () => { 
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
  console.log('--- ¡ADVERTENCIA! La conexión a la DB NO se estableció al inicio. ---');
});

// --- Ya no necesitamos el bloque .then().catch() para la DB aquí ---
/*
connectToDatabase()
  .then(conn => {
    dbConnection = conn;
    console.log('🟢 Aplicación conectada a la base de datos. Iniciando servidor Express...');

    app.use((req, res, next) => {
      req.db = dbConnection;
      next();
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('🔴 Error fatal: No se pudo iniciar la aplicación debido a la conexión a la DB:', err);
    process.exit(1);
  });
*/

// --- NOTA IMPORTANTE para tus rutas (contactosRoutes) ---
// CON ESTE CAMBIO, tus rutas NO tendrán acceso a 'req.db'.
// Si tus rutas intentan hacer consultas a la base de datos, ¡fallarán!
// Este es un método TEMPORAL para asegurar que el servidor Express arranque.
// Para que las rutas funcionen con la DB, necesitarás reincorporar la lógica de conexión.