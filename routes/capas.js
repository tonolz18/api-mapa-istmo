const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ruta dinámica para cualquier capa
router.get('/:nombre', async (req, res) => {
  const nombreCapa = req.params.nombre;

  try {
    const resultado = await pool.query(`
      SELECT 
        id, nombre, tipo, categoria,
        ST_AsGeoJSON(geom)::json AS geometry
      FROM ${nombreCapa}
    `);

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
