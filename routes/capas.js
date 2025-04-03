const express = require('express');
const pool = require('../db');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/:nombre', verifyToken, async (req, res) => {
  const nombreCapa = req.params.nombre;
  const limit = parseInt(req.query.limit) || 1000;
  const offset = ((parseInt(req.query.page) || 1) - 1) * limit;

  try {
    const resultado = await pool.query(`
      SELECT 
        id, nombre, tipo, categoria,
        ST_AsGeoJSON(geom)::json AS geometry
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
    res.status(500).json({ error: `No se pudo obtener la capa '${nombreCapa}'` });
  }
});

module.exports = router;
