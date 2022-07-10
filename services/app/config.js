const getFromEnvironment = (key, required = true) => {
  const value = process.env[key];

  if (value == undefined && required)
    throw Error(`Environment variable not set: ${key}`);

  return value;
};

const requiredVars = [
  // TODO make database independent
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_DB",
  "POSTGRES_PORT",
];

const optionalVars = ["GOOGLE_ANALYTICS_TAG", "GOOGLE_ADSENSE_TAG"];

const config = {};

requiredVars.forEach((key) => {
  config[key] = getFromEnvironment(key);
});

optionalVars.forEach((key) => {
  config[key] = getFromEnvironment(key, false);
});

config["POSTGRES_HOST"] = "database";

module.exports = config;
