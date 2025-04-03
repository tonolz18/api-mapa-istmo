const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

app.get("/", (req, res) => {
  res.send("🌍 API Mapa Istmo conectada");
});

app.get("/api/etiquetas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM etiquetas_capas ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar etiquetas" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor API escuchando en http://localhost:${PORT}`);
=======
const capasRoutes = require('./routes/capas');
app.use('/api/capas', capasRoutes);

app.use(cors());
app.use("/api/capas", capasRoutes);

app.listen(3000, () => {
  console.log("Servidor escuchando en http://localhost:3000");
>>>>>>> f6ee8ac (Agregadas rutas dinámicas para capas geoespaciales)
});
