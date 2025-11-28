import axios from "axios";

export const UsersAll = async (token) =>
  await axios.get(import.meta.env.VITE_API_URL + "/getallusers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const UserDelete = async (userId, token) =>
  await axios.post(
    import.meta.env.VITE_API_URL + "/deleteuser",
    { userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
