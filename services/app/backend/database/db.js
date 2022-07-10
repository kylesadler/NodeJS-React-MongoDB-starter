const fs = require("fs");
const { Pool } = require("pg");
const tunnel = require("tunnel-ssh");
const { waitUntil } = require("../../simulatorv1/util/util");

if (!process.env.SSH_PKEY) throw Error("environment variables not set.");

var connectionPool;

const SSHTunnelConfig = {
  username: process.env.SSH_USER,
  dstPort: process.env.POSTGRES_PORT,
  localPort: 5432,
  host: process.env.DATABASE_IP,
  privateKey: fs.readFileSync(process.env.SSH_PKEY),
  //   keepAlive: true,
};

tunnel(SSHTunnelConfig, async (error, _) => {
  if (error) {
    console.log(`SSH connection error:\n ${error}`);
  }

  connectionPool = new Pool({
    user: process.env.POSTGRES_USER,
    host: "127.0.0.1",
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASS,
    port: 5432,
    idleTimeoutMillis: 0, // disable client timeout
  });
});

const getDatabase = async () => {
  await waitUntil(() => {
    return !!connectionPool;
  });
  return connectionPool;
};

// function returning promise with db client pool
// usage:
// const { getDatabase } = require("./db");
// db = await getDatabase();
// db.query(...)
module.exports = { getDatabase };
