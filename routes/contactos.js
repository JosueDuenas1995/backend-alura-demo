// routes/contactos.js
const { body, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();

// --- Datos de ejemplo para simular la base de datos ---
let mockContacts = [
  { id: 1, nombre_completo: 'Juan Pérez', email: 'juan@example.com', telefono: '111-222-3333' },
  { id: 2, nombre_completo: 'Ana Gómez', email: 'ana@example.com', telefono: '444-555-6666' },
  { id: 3, nombre_completo: 'Pedro Ramírez', email: 'pedro@example.com', telefono: '777-888-9999' }
];

// --- Obtener todos los contactos (SIMULADO) ---
router.get('/', (req, res) => {
  console.log('Simulando obtención de contactos...');
  res.json(mockContacts);
});

// --- Ruta POST (SIMULADA) ---
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
    // Asigna un ID simulado
    const newId = mockContacts.length > 0 ? Math.max(...mockContacts.map(c => c.id)) + 1 : 1;
    const newContact = { id: newId, ...datos };
    mockContacts.push(newContact); // Agrega al array simulado
    console.log('Simulando creación de contacto:', newContact);
    res.status(201).json(newContact);
  }
);

module.exports = router;




