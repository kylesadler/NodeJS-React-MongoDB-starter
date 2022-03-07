const mongoose = require("mongoose");
const tunnel = require("tunnel-ssh");
const fs = require("fs");

export default ({
  host,
  username,
  privateKey,
  databaseName, // name of mongo database

  // optional
  localPort,
  dstPort,
}) => {
  tunnel(
    {
      host,
      username,
      privateKey,
      dstPort: dstPort || 27017,
      localPort: localPort || 27000,
      // keepAlive:true,
    },
    (error, tnl) => {
      if (error) {
        console.log("SSH connection error: " + error);
      }

      //Connect
      mongoose.connect(`mongodb://localhost:27017/${databaseName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      //On Connect
      mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
      });

      //On Error
      mongoose.connection.on("error", (error) => {
        console.log("Error in Database connection: " + error);
      });
    }
  );
};
