const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ruta dinámica para obtener una capa geoespacial
router.get('/:nombre', async (req, res) => {
  const nombreCapa = req.params.nombre;
  const limit = parseInt(req.query.limit) || 500;     // Límite por defecto: 500
  const offset = parseInt(req.query.offset) || 0;     // Offset por defecto: 0

  try {
    const resultado = await pool.query(`
      SELECT 
        id, nombre, tipo, categoria,
        ST_AsGeoJSON(ST_SimplifyPreserveTopology(geom, 0.001))::json AS geometry
      FROM ${nombreCapa}
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const features = resultado.rows.map(row => ({
      type: 'Feature',
      geometry: row.geometry,
      properties: {
        id: row.id,
        nombre: row.nombre,
        tipo: row.tipo,
        categoria: row.categoria
      }
    }));

    res.json({
      type: 'FeatureCollection',
      features
    });

  } catch (err) {
    console.error('❌ Error al consultar capa:', nombreCapa, err.message);
    res.status(500).json({ error: `No se pudo obtener la capa '${nombreCapa}'` });
  }
});

module.exports = router;
