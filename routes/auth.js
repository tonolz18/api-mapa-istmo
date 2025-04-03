const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const usuarios = [
  {
    id: 1,
    username: "admin",
    password: "$2b$10$uR.2nRHUZMXbFxPEnmOJSe7M.mDZ/7Qz1H5Lep/mTxYYqgLdDPqTy" // '1234' encriptado
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
