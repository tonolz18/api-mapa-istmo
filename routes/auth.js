const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const usuarios = [
  {
    id: 1,
    username: "admin",
    password: "$2b$10$07WO1/awK0Rq9QDGz3hcf.o/9TwmNOaOrOYHKrF49RnJLmF9fB9Eq" // '1234' encriptado
  }
];

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = usuarios.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "2h"
  });

  res.json({ token });
});

module.exports = router;
