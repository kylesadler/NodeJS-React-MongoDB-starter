const express = require("express");
const router = express();
// const TestModel = require("./database/models/TestModel");
const { handleData } = require("./util");

router.get("/", (request, response) => {
  response.json({ test: "passed" });
});

module.exports = router;
