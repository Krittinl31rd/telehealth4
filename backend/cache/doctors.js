const doctorStatus = new Map();
// key = doctor_id, value = { status, timestamp, ws_client_id }

module.exports = {
  setDoctorStatus: (doctor_id, data) => doctorStatus.set(doctor_id, data),
  getDoctorStatus: (doctor_id) => doctorStatus.get(doctor_id),
  getAllOnlineDoctors: () =>
    Array.from(doctorStatus).filter(([, v]) => v.status == 1),
  removeDoctor: (doctor_id) => doctorStatus.delete(doctor_id),
};
