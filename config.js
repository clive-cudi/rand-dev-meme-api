const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const SUPA_API_KEY = process.env.SUPA_API_KEY ?? "";
const SUPA_PROJECT_URL = process.env.SUPA_PROJECT_URL ?? "";
const SUPA_PSQL_PASS = process.env.SUPA_PSQL_PASS ?? "";

module.exports = {
  SUPA_API_KEY,
  SUPA_PROJECT_URL,
  SUPA_PSQL_PASS,
};
