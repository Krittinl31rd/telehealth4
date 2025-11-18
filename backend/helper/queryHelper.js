const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

async function runQuery(
  query,
  params = {},
  type = QueryTypes.SELECT,
  transaction = null
) {
  try {
    const options = {
      replacements: params,
      type,
    };
    if (transaction) {
      options.transaction = transaction;
    }
    const result = await sequelize.query(query, options);
    return result;
  } catch (error) {
    console.error("runQuery error:", error.message);
    throw error;
  }
}

module.exports = runQuery;
