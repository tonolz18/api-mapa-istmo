const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Middleware para proteger rutas
const verificarToken = require("./middleware/authMiddleware");

// Rutas públicas
app.get("/", (req, res) => {
  res.send("🌍 API Mapa Istmo conectada");
});

// Ruta protegida
app.get("/api/etiquetas", verificarToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM etiquetas_capas ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar etiquetas" });
  }
});

// Rutas protegidas
const capasRoutes = require('./routes/capas');
app.use('/api/capas', verificarToken, capasRoutes);

// Ruta de autenticación
const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);

// Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor API escuchando en http://localhost:${PORT}`);
});
