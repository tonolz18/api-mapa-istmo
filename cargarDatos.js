const fs = require("fs");
const path = require("path");
const pool = require("./db");
const vm = require("vm");

function cargarVariableDesdeArchivo(ruta, nombreVariable) {
  const contenido = fs.readFileSync(ruta, "utf8");
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(contenido, sandbox);
  if (sandbox[nombreVariable]) {
    return sandbox[nombreVariable];
  }
  throw new Error(`No se pudo obtener la variable ${nombreVariable}`);
}

function limpiarCoordenadas(coordenadas) {
  if (typeof coordenadas[0] === "number") {
    return [coordenadas[0], coordenadas[1]]; // fuerza 2D
  }

  return coordenadas.map((subCoord) => limpiarCoordenadas(subCoord));
}

function eliminarZDeGeometria(geometry) {
  if (!geometry || !geometry.coordinates) return geometry;
  return {
    type: geometry.type,
    coordinates: limpiarCoordenadas(geometry.coordinates)
  };
}

async function insertarDatos(nombreTabla, datos) {
  for (const feature of datos.features) {
    let geom = eliminarZDeGeometria(feature.geometry);
    const geojson = JSON.stringify(geom);
    const props = feature.properties || {};
    const nombre = props.ORIGEN || props.nombre || "Sin nombre";
    const tipo = props.Tipo || props.tipo || null;
    const categoria = props.Tabla || props.categoria || null;

    await pool.query(
      `INSERT INTO ${nombreTabla} (nombre, tipo, categoria, geom) VALUES ($1, $2, $3, ST_SetSRID(ST_GeomFromGeoJSON($4), 4326))`,
      [nombre, tipo, categoria, geojson]
    );
  }
}

async function subirTodo() {
  const capas = [
    { nombre: "aeropuertos", archivo: "aeropuertos.js", variable: "data_aeropuertos" },
    { nombre: "puertos", archivo: "puertos.js", variable: "data_puertos" },
    { nombre: "cruces_fronterizos", archivo: "cruces_fronterizos.js", variable: "data_cruces_fronterizos" },
    { nombre: "estaciones_ffcc", archivo: "estaciones_ffcc.js", variable: "data_estaciones_ffcc" },
    { nombre: "podebis", archivo: "podebis.js", variable: "data_podebis" },
    { nombre: "zonaciit", archivo: "zonaciit.js", variable: "data_zonaciit" },
    { nombre: "red_att_4g", archivo: "red_att_4g.js", variable: "data_red_att_4g" },
    { nombre: "red_telcel_4g", archivo: "red_telcel_4g.js", variable: "data_red_telcel_4g" },
    { nombre: "red_movistar_2g", archivo: "red_movistar_2g.js", variable: "data_red_movistar_2g" },
    { nombre: "rutas_aereo", archivo: "rutas_aereo.js", variable: "data_rutas_aereo" },
    { nombre: "rutas_maritimo", archivo: "rutas_maritimo.js", variable: "data_rutas_maritimo" },
    { nombre: "rutas_ffcc", archivo: "rutas_ffcc.js", variable: "data_rutas_ffcc" },
    { nombre: "rutas_carretera", archivo: "rutas_carretera.js", variable: "data_rutas_carretera" },
    { nombre: "lineasistmo", archivo: "Ferrocarril_Istmo_de_Tehuantepec/LineasIstmo.js", variable: "data_lineasistmo" }
  ];

  for (const capa of capas) {
    console.log(`🟡 Procesando ${capa.nombre}...`);
    try {
      const ruta = path.join(__dirname, "data/jsonfiles", capa.archivo);
      const datos = cargarVariableDesdeArchivo(ruta, capa.variable);
      await insertarDatos(capa.nombre, datos);
      console.log(`✅ Insertados datos de ${capa.nombre}`);
    } catch (error) {
      console.error(`❌ Error al insertar en ${capa.nombre}:`, error.message);
    }
  }
}

subirTodo();
