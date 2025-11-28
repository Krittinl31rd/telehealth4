import axios from "axios";

export const GetDoctors = async (token) =>
  await axios.get(import.meta.env.VITE_API_URL + "/getdoctors", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
