import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const getScheduledEmails = async () => {
  const res = await api.get("/email/scheduled");
  return res.data;
};

export const getSentEmails = async () => {
  const res = await api.get("/email/sent");
  return res.data;
};

export const scheduleEmails = async (payload) => {
  const res = await api.post("/email/schedule", payload);
  return res.data;
};
