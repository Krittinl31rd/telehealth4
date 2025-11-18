const { QueryTypes } = require("sequelize");
const runQuery = require("../helper/queryHelper");
const {
  sendToClientID,
  broadcastToLogInClients,
} = require("../utils/wsClients");
const { measurement_types, sectionList } = require("../constant/enum");

exports.Measurements = async (req, res) => {
  const { action, deviceID, datas } = req.body;
  const data = datas[0];

  try {
    const [isDevices] = await runQuery(
      `SELECT device_id FROM devices WHERE device_id = :deviceID`,
      { deviceID },
      QueryTypes.SELECT
    );

    if (!isDevices) {
      return res
        .status(200)
        .json({ retCode: 0, msg: "failed (device not found)" });
    }

    const [match] = await runQuery(
      `SELECT id FROM users WHERE id = :id`,
      { id: parseInt(data.UID) },
      QueryTypes.SELECT
    );

    if (!match) {
      return res
        .status(200)
        .json({ retCode: 0, msg: "failed (user not found)" });
    }

    const [measurement] = await runQuery(
      `
        INSERT INTO measurements
        (device_id, uid, patient_id, occur_time, raw_json)
        VALUES
        (:device_id, :uid, :patient_id, :occur_time, :raw_json)
      `,
      {
        device_id: deviceID,
        uid: data.UID,
        patient_id: match.id,
        occur_time: data.occurTime,
        raw_json: JSON.stringify(data),
      },
      QueryTypes.INSERT
    );

    const measurement_id = measurement;

    for (const section of sectionList) {
      if (data[section]) {
        await insertSectionAuto(section, data[section], measurement_id);
      }
    }

    return res.status(200).json({ retCode: 1, msg: "success" });
  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

async function insertSectionAuto(sectionName, sectionData, measurement_id) {
  if (!sectionData) return;

  const typeId = measurement_types[sectionName];
  if (!typeId) return;

  let valuesSQL = [];
  let params = {};
  let index = 0;

  for (const field in sectionData) {
    index++;

    const p_m = `m${index}`;
    const p_t = `t${index}`;
    const p_f = `f${index}`;
    const p_v = `v${index}`;
    const p_n = `n${index}`;

    valuesSQL.push(`(:${p_m}, :${p_t}, :${p_f}, :${p_v}, :${p_n})`);

    params[p_m] = measurement_id;
    params[p_t] = typeId;
    params[p_f] = field;
    params[p_v] = sectionData[field];

    const normalField = `${field}_normal`;
    params[p_n] = sectionData[normalField] ?? null;
  }

  const sql = `
    INSERT INTO measurement_values 
    (measurement_id, type_id, field, value, normal_range)
    VALUES ${valuesSQL.join(",")}
  `;

  return runQuery(sql, params, QueryTypes.INSERT);
}
