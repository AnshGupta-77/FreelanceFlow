export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = "active" | "completed" | "overdue" | "cancelled";

export interface Project {
  id: string;
  user_id: string;
  client_id: string;
  client?: Client;
  name: string;
  description?: string;
  budget: number;
  amount_paid: number;
  status: ProjectStatus;
  deadline: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  project_id: string;
  project?: Project;
  amount: number;
  payment_date: string;
  payment_method?: string;
  notes?: string;
  is_received: boolean;
  created_at: string;
}

export type ReminderType = "deadline" | "payment" | "follow_up" | "custom";

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  reminder_type: ReminderType;
  due_date: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalRevenue: number;
  pendingPayments: number;
  activeProjects: number;
  overdueProjects: number;
  totalClients: number;
}

export interface MonthlyEarning {
  month: string;
  amount: number;
}

export interface TopClient {
  client: Client;
  totalRevenue: number;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
