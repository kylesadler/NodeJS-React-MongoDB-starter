const tunnel = require("tunnel-ssh");
const { MongoClient } = require("mongodb");

var client;
const initDatabase = ({
  host,
  username,
  privateKey,
  databaseName = "prod", // name of mongo database

  // optional
  localPort = 27000,
  dstPort = 27017,
}) => {
  tunnel(
    {
      host,
      username,
      privateKey,
      dstPort,
      localPort,
      keepAlive: true,
    },
    async (error, tnl) => {
      if (error) {
        console.log("SSH connection error: " + error);
      }

      _client = new MongoClient(
        `mongodb://localhost:${localPort}/${databaseName}`
      );
      client = await _client.connect();
    }
  );
};

exports.initDatabase = initDatabase;
exports.getClient = async () => {
  const tryAgain = (res) => {
    if (client) {
      res(client);
    } else {
      setTimeout(() => {
        tryAgain(res);
      }, 100);
    }
  };
  return new Promise(tryAgain);
};

// async function run() {
//   try {
//     // Connect the client to the server
//     await client.connect();
//     // Establish and verify connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Connected successfully to server");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
