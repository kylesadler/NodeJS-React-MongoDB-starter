const { Pool } = require("pg");
const { waitUntil } = require("./util");
const config = require("../../config");

var connectionPool = new Pool({
  user: config.POSTGRES_USER,
  database: config.POSTGRES_DB,
  host: config.POSTGRES_HOST,
  password: config.POSTGRES_PASSWORD,
  port: config.POSTGRES_PORT,
  idleTimeoutMillis: 0, // disable client timeout
});

const getDatabase = async () => {
  await waitUntil(() => {
    return !!connectionPool;
  });
  return connectionPool;
};

// function returning promise with db client pool
// usage:
// const { getDatabase } = require("./postgres");
// db = await getDatabase();
// db.query(...)
module.exports = { getDatabase };
