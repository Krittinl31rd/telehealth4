import axios from "axios";

export const GetMeasurementsTypes = async (token) =>
  await axios.get(import.meta.env.VITE_API_URL + "/measurements_types", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const ReadMeasurementsByTypeAndID = async (token, form) =>
  await axios.post(import.meta.env.VITE_API_URL + "/readmeasurements", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
