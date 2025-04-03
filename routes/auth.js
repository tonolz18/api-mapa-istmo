const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

const usuarios = [
  { id: 1, username: 'admin', password: bcrypt.hashSync('admin123', 10) } // puedes cambiar
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = usuarios.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign({ id: user.id, username: user.username }, 'secreto', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
