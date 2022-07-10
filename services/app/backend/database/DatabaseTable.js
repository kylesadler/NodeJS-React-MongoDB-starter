const { getDatabase } = require("./postgres");

const toPlaceholderIndex = (index, offset = 0) => {
  return `$${index + 1 + offset}`;
};

// turns an object into 'key1 = $1, key2 = $2, ...'
// offset offsets the placeholders incase you're using
// the function twice in the same query
const objectToPlaceholders = (object, offset) => {
  return Object.keys(object).map((key, index) => {
    return `"${key}" = ` + toPlaceholderIndex(index, offset);
  });
};

// turns a number n into '$1, $2, $3, ..., $n'
const numberedPlaceholders = (n, offset) => {
  return [...Array(n).keys()].map((_, i) => {
    return toPlaceholderIndex(i, offset);
  });
};

// TODO protect against SQL injection
module.exports = class DatabaseTable {
  constructor(name) {
    this.name = name;
  }

  // leave blank to find all
  async find(searchValues) {
    const search = searchValues || {};
    const query =
      Object.entries(search).length == 0
        ? `SELECT * FROM ${this.name};`
        : {
            text: `SELECT * FROM ${this.name} WHERE ${objectToPlaceholders(
              search
            ).join(" AND ")};`,
            values: Object.values(search),
          };

    return this._execute(query);
  }

  async insert(jsonObject) {
    const keys = Object.keys(jsonObject);

    return this._execute({
      text: `INSERT INTO ${this.name} (${keys
        .map((k) => `"${k}"`)
        .join(", ")}) VALUES (${numberedPlaceholders(keys.length).join(
        ", "
      )}) RETURNING id;`,
      values: Object.values(jsonObject),
    });
  }

  async update(search, newValues) {
    const newValueKeys = Object.keys(newValues);

    return this._execute({
      text: `UPDATE ${this.name} SET ${objectToPlaceholders(newValues).join(
        ", "
      )} WHERE ${objectToPlaceholders(search, newValueKeys.length).join(
        " AND "
      )} RETURNING id;`,
      values: [...Object.values(newValues), ...Object.values(search)],
    });
  }

  async _execute(queryObject) {
    const db = await getDatabase();
    console.log("executing query", queryObject);
    return db.query(queryObject).catch((err) => {
      console.log(err);
    });
  }
};
