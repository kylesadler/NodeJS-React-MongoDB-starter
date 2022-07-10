const { handleData } = require("../../util");

export default function handler(request, response) {
  response.status(200).json({ test: "passed" });
}
