import { api } from "./api";
import type { Client } from "../types";

interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
}

interface UpdateClientData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export const clientService = {
  async getAll(): Promise<Client[]> {
    const response = await api.get<Client[]>("/clients/");
    return response.data;
  },

  async getById(id: string): Promise<Client> {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  },

  async create(data: CreateClientData): Promise<Client> {
    const response = await api.post<Client>("/clients/", data);
    return response.data;
  },

  async update(id: string, data: UpdateClientData): Promise<Client> {
    const response = await api.put<Client>(`/clients/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/clients/${id}`);
  },
};
