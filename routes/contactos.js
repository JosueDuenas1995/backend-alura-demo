// routes/contactos.js
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

// Crear nuevo contacto
router.post('/', (req, res) => {
  const datos = req.body;
  const sql = 'INSERT INTO contactos SET ?';
  db.query(sql, datos, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, ...datos });
  });
});

module.exports = router;




