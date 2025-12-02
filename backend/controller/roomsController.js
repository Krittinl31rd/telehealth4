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
const dayjs = require("dayjs");
const crypto = require("crypto");

const generateRandomString = (length = 6) =>
  crypto.randomBytes(length).toString("hex").slice(0, length);

exports.CreateRoom = async (req, res) => {
  const { patient_id, doctor_id } = req.body;
  try {
    if (!patient_id || !doctor_id) {
      return res
        .status(400)
        .json({ message: "Missing patient_id or doctor_id" });
    }

    // create room_code and expires_at
    const room_code = generateRandomString(8);
    const expires_at = dayjs().add(1, "hour").format("YYYY-MM-DD HH:mm:ss");

    // create room
    const insertRoomQuery = `
      INSERT INTO rooms (room_code, doctor_id, patient_id, expires_at)
      VALUES (:room_code, :doctor_id, :patient_id, :expires_at)
    `;
    const roomResult = await runQuery(
      insertRoomQuery,
      {
        room_code,
        doctor_id,
        patient_id,
        expires_at,
      },
      QueryTypes.INSERT
    );
    console.log(roomResult);
    // const room_id = roomResult.insertId;

    // // creatae token for doctor and patient
    // const doctor_token = crypto.randomBytes(16).toString("hex");
    // const patient_token = crypto.randomBytes(16).toString("hex");

    // const insertTokenQuery = `
    //   INSERT INTO room_tokens (room_id, token, user_id, expires_at)
    //   VALUES (?, ?, ?, ?), (?, ?, ?, ?)
    // `;
    // await runQuery(insertTokenQuery, [
    //   room_id,
    //   doctor_token,
    //   doctor_id,
    //   expires_at,
    //   room_id,
    //   patient_token,
    //   patient_id,
    //   expires_at,
    // ]);

    // return res.json({
    //   room_code,
    //   patient_link: `/join/${room_code}?token=${patient_token}`,
    //   doctor_link: `/join/${room_code}?token=${doctor_token}`,
    // });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Patient selects Doctor
//       ↓
// Backend create new room in "rooms"
//       ↓
// Backend generate tokens in "room_tokens"
//       ↓
// Send unique link to patient/doctor
//       ↓
// User opens link → frontend sends request to /rooms/check
//       ↓
// Backend validates room + token + expiry
//       ↓
// If valid → Join WebRTC room via Socket.io
//       ↓
// Doctor joins → status = active
//       ↓
// Call ongoing
//       ↓
// End call → status = ended + revoke tokens
