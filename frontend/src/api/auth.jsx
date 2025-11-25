import axios from "axios";

export const Current = async (token) =>
  await axios.get(import.meta.env.VITE_API_URL + "/authme", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
export const UpdateProfile = async (token,form) =>
  await axios.post(import.meta.env.VITE_API_URL + "/updateprofile", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });