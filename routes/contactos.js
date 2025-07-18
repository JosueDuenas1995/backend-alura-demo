// routes/contactos.js
const { body, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los contactos
router.get('/', (req, res) => {
  db.query('SELECT * FROM contactos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ''' post 
router.post('/',
  [
    body('nombre_completo').isString().notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email inválido')
    // Agrega más validaciones según tu modelo
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const datos = req.body;
    const sql = 'INSERT INTO contactos SET ?';
    db.query(sql, datos, (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ id: result.insertId, ...datos });
    });
  }
);

module.exports = router;




