// routes/contactos.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../db'); // ← conexión real con Cloud SQL

// Obtener todos los contactos desde la base de datos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contactos');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener contactos:', error);
    res.status(500).json({ error: 'Error al obtener contactos' });
  }
});

// Insertar un nuevo contacto
router.post(
  '/',
  [
    body('nombre_completo').isString().notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email inválido'),
    body('telefono').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre_completo, email, telefono } = req.body;

    try {
      const [result] = await db.query(
        'INSERT INTO contactos (nombre_completo, email, telefono) VALUES (?, ?, ?)',
        [nombre_completo, email, telefono]
      );
      const newContact = { id: result.insertId, nombre_completo, email, telefono };
      res.status(201).json(newContact);
    } catch (error) {
      console.error('❌ Error al insertar contacto:', error);
      res.status(500).json({ error: 'Error al insertar contacto' });
    }
  }
);

module.exports = router;






