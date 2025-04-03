const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://admin_mapa:9GhgQF6VImvxaRmAPa2f8rnBcLmVSmVh@dpg-cvfpph7noe9s73bjiea0-a.oregon-postgres.render.com/mapa_digital",
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
