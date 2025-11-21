import axios from "axios";

export const Current = async (token) =>
  await axios.get(import.meta.env.VITE_API_URL + "/authme", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
