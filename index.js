const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Cargar documento de Swagger
const swaggerDocument = YAML.load('./swagger.yaml');

// Configurar conexión a PostgreSQL
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Rutas principales
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

// 👉 IMPORTAR rutas después de definir middleware y antes de usarlas
const capasRouter = require('./routes/capas');
const authRouter = require('./routes/auth'); // si tienes auth.js, si no comenta esta línea

// Usar las rutas
app.use('/api/capas', capasRouter);
app.use('/api/auth', authRouter); // si no tienes auth aún, comenta esta línea
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor API escuchando en http://localhost:${PORT}`);
});


