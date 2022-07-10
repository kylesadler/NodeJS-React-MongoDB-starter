const { handleData } = require("../../util");

const DatabaseTable = require("../../../backend/database/DatabaseTable");

const simulationsTable = new DatabaseTable("simulations");

export default async function handler(request, response) {
  const data = await simulationsTable.find();
  response.status(200).json({
    text: "await simulationsTable.find()",
    data: data.rows,
  });
}
