const { QueryTypes } = require("sequelize");
const runQuery = require("../helper/queryHelper");
const {
  sendToClientID,
  broadcastToLogInClients,
  getWsClients,
} = require("../utils/wsClients");
const {
  measurement_types,
  sectionList,
  ws_cmd,
  user_role,
} = require("../constant/enum");
const { setDoctorStatus } = require("../cache/doctors");

exports.GetDoctors = async (req, res) => {
  try {
    const resp = await runQuery(
      `
        SELECT
        u.id,
        u.name,
        u.sex,
        u.profile_image_url,
        sep.id,
        sep.name AS sep_name,
        sep.description,
        d.license_number,
        d.years_of_experience,
        d.affiliated_hospital,
        d.profile_detail,
        d.status
        FROM users u
        LEFT JOIN doctor d ON d.doctor_id = u.id
        LEFT JOIN specialization sep ON sep.id = d.specialization_id
        WHERE role = :role AND d.status = 1
        `,
      { role: user_role.d },
      QueryTypes.SELECT
    );
    return res.status(200).json(resp);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.HandleStatus = async (req, res) => {
  try {
    const { id } = req.authUser;
    const { status } = req.body;

    await runQuery(
      `UPDATE doctor SET status = :status WHERE doctor_id = :doctor_id`,
      {
        status,
        doctor_id: id,
      },
      QueryTypes.UPDATE
    );

    setDoctorStatus(id);

    const payload = {
      cmd: ws_cmd.doctor_status,
      params: { doctor_id: id, status },
    };
    await broadcastToLogInClients(payload);

    return res.status(200).json({
      message: `Change status to ${status == 0 ? "Offline" : "Online"}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
