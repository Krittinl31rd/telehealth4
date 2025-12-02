const runQuery = require("../helper/queryHelper");
const { setDoctorStatus, getAllOnlineDoctors } = require("../cache/doctors");

async function loadDoctorsStatus() {
  const rows = await runQuery(`SELECT doctor_id, status FROM doctor`);
  rows.forEach((row) => {
    setDoctorStatus(row.doctor_id, {
      status: row.status,
      ws_id: null,
      timestamp: Date.now(),
    });
  });
  console.log("Doctors status loaded to cache");
}

module.exports = { loadDoctorsStatus };
