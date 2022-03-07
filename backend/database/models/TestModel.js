const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

export default mongoose.model("TestModel", Schema);
