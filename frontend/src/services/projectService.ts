import { api } from "./api";
import type { Project, ProjectStatus } from "../types";

interface CreateProjectData {
  name: string;
  client_id: string;
  budget: number;
  deadline: string;
  description?: string;
  status?: ProjectStatus;
}

interface UpdateProjectData {
  name?: string;
  client_id?: string;
  budget?: number;
  deadline?: string;
  description?: string;
  status?: ProjectStatus;
}

export const projectService = {
  async getAll(status?: ProjectStatus): Promise<Project[]> {
    const params = status ? { status } : {};
    const response = await api.get<Project[]>("/projects/", { params });
    return response.data;
  },

  async getById(id: string): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async create(data: CreateProjectData): Promise<Project> {
    const response = await api.post<Project>("/projects/", data);
    return response.data;
  },

  async update(id: string, data: UpdateProjectData): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
