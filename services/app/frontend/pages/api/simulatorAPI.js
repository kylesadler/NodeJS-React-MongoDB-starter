// const express = require("express");
// const router = express();
// const http = require("http");
// const https = require("https");
// const DatabaseTable = require("../../../backend/database/DatabaseTable");
// const networkData = require("../frontend/src/util/NetworkRoutes/NetworkSelect/networkData");

// const simulationsTable = new DatabaseTable("simulations");
// const networksTable = new DatabaseTable("networks");

// // if database is down, for example
// // const useLocalData = true;
// const useLocalData = false;

// router.get("/getNetworks", async (request, response) => {
//   if (useLocalData) {
//     response.json({ networks: networkData.maps });
//   } else {
//     const networks = await networksTable.find();
//     response.json({ networks: networks.rows });
//   }
// });

// router.get("/getSimulations", async (request, response) => {
//   if (useLocalData) {
//     response.json({ simulations: [] });
//   } else {
//     const simulations = await simulationsTable.find();
//     response.json({ simulations: simulations.rows });
//   }
// });

// const defaultNetworkBounds = {
//   south: 25.781251396757007,
//   west: -128.84835679693302,
//   north: 49.00640774151213,
//   east: -70.83431366768349,
// };

// router.post("/createNetwork", async (request, response) => {
//   const { config, name, route, image } = request.body;

//   networksTable
//     .insert({
//       config: config || { bounds: defaultNetworkBounds },
//       name,
//       route,
//       image,
//     })
//     .then((res) => {
//       response.json(res.rows[0]);
//     });
// });

// router.post("/saveNetwork", async (request, response) => {
//   const { id } = request.body;
//   networksTable.update({ id }, request.body);
// });

// router.post("/saveSimulation", async (request, response) => {
//   const { id } = request.body;
//   simulationsTable.update({ id }, request.body);
// });

// router.post("/createSimulation", async (request, response) => {
//   const { config, name, networkId, results, type } = request.body;
//   if (!type) throw "No simulation type provided";

//   simulationsTable
//     .insert({
//       config,
//       name,
//       networkId,
//       results,
//       type,
//     })
//     .then((res) => {
//       response.json(res.rows[0]);
//     });
// });

// module.exports = router;
