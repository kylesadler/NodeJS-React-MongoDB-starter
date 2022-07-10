/**
 * Makes a callback function to handle database query using current response object
 * @param  {Object} response    The current response object
 * @return {Function}           Callback function for the query, (err, data) => {...}
 */
exports.handleData = (response) => {
  return (error, data) => {
    if (error) {
      console.log("ERROR: " + error.message);
      response.status(500).json({ error: error.message });
    } else {
      response.status(200).json(data);
    }
  };
};
