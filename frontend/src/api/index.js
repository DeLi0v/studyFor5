import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // URL бэка
  headers: {
    "Content-Type": "application/json",
  },
});

// Возвращаем только data
export const getAll = async (entity) => {
  const res = await api.get(`/${entity}`);
  return res.data;
};

export const getById = async (entity, id) => {
  const res = await api.get(`/${entity}/${id}`);
  return res.data;
};

export const create = async (entity, data) => {
  const res = await api.post(`/${entity}`, data);
  return res.data;
};

export const update = async (entity, id, data) => {
  const res = await api.put(`/${entity}/${id}`, data);
  return res.data;
};

export const remove = async (entity, id) => {
  const res = await api.delete(`/${entity}/${id}`);
  return res.data;
};

export default api;
