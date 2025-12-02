import axios from "axios";

export const GetDoctors = async (token) =>
  await axios.get(import.meta.env.VITE_API_URL + "/getdoctors", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const HandleDoctorStatus = async (token, status) =>
  await axios.post(
    import.meta.env.VITE_API_URL + "/changestatus",
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
