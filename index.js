// index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); 
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const contactosRoutes = require('./routes/contactos');

app.use(helmet()); // <-- Usa helmet
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/contactos', contactosRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 8080; // Cloud Run inyectará PORT
app.listen(PORT, '0.0.0.0', () => { // Escucha en 0.0.0.0 para todas las interfaces
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});

//nueva actualizacionde prueba
//intento de prueba 