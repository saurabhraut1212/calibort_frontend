// src/services/userApi.ts
import api from "./api";

export interface IUser {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
  role: "admin" | "user";
  provider: "local" | "reqres";
  created_at?: string;
}

export async function fetchUsers(page = 1, limit = 10, q = "") {
  const res = await api.get(`/api/users?page=${page}&limit=${limit}&q=${q}`);
  return res.data.data;
}

export async function getUser(id: number) {
  const res = await api.get(`/api/users/${id}`);
  return res.data.data.user as IUser;
}

export async function createUser(data: Partial<IUser> & { password?: string }) {
  const res = await api.post(`/api/users`, data);
  return res.data.data;
}

export async function updateUser(id: number, data: Partial<IUser> & { password?: string }) {
    console.log("Updating user with data:", data);
  const res = await api.put(`/api/users/${id}`, data);
  
  return res.data.data;
}

export async function deleteUser(id: number) {
  const res = await api.delete(`/api/users/${id}`);
  return res.data.data;
}

export async function importReqres(page = 1) {
  const res = await api.post(`/api/import/reqres?page=${page}`);
  return res.data.data;
}
