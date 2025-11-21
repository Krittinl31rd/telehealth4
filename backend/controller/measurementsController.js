const { QueryTypes } = require("sequelize");
const runQuery = require("../helper/queryHelper");
const {
  sendToClientID,
  broadcastToLogInClients,
} = require("../utils/wsClients");
const { measurement_types, sectionList, ws_cmd } = require("../constant/enum");

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
        const payload_ws = {
          cmd: ws_cmd.measurement_result,
          params: data[section],
        };
        await sendToClientID(match.id, payload_ws);
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

exports.MeasurementsTypes = async (req, res) => {
  try {
    const result = await runQuery(
      `SELECT * FROM measurement_types WHERE code NOT IN (:code)`,
      { code: ["zytz", "sds", "fei", "gmd", "com"] },
      QueryTypes.SELECT
    );

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.ReadMeasurementsByTypeAndID = async (req, res) => {
  const { patient_id, type_id } = req.body;
  try {
    const rows = await runQuery(
      `
      SELECT 
        m.id,
        m.device_id,
        m.patient_id,
        mv.type_id,
        mv.field,
        mv.value,
        m.created_at
      FROM measurements m
      LEFT JOIN measurement_values mv ON mv.measurement_id = m.id
      WHERE m.patient_id = :patient_id AND mv.type_id = :type_id
      ORDER BY m.created_at DESC
      `,
      { patient_id, type_id },
      QueryTypes.SELECT
    );

    const grouped = Object.values(
      rows.reduce((acc, row) => {
        if (!acc[row.id]) {
          acc[row.id] = {
            id: row.id,
            device_id: row.device_id,
            patient_id: row.patient_id,
            type_id: row.type_id,
            created_at: row.created_at,
            values: {},
          };
        }
        acc[row.id].values[row.field] = row.value;
        return acc;
      }, {})
    );

    return res.status(200).json(grouped);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
