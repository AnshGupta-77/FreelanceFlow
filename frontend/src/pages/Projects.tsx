import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { CurrencySelect } from "../components/ui/CurrencySelect";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { SkeletonTable } from "../components/ui/Skeleton";
import { Search, Plus, Calendar, DollarSign } from "lucide-react";
import { formatCurrency, formatDate } from "../lib/utils";
import type { Project, ProjectStatus, Client } from "../types";

export function Projects() {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    { 
      id: "1", 
      name: "Website Redesign", 
      client: { name: "Acme Corp" } as Client,
      budget: 5000, 
      amount_paid: 2500, 
      status: "active",
      deadline: "2024-12-31",
      created_at: "2024-01-15"
    },
    { 
      id: "2", 
      name: "Mobile App", 
      client: { name: "TechStart" } as Client,
      budget: 15000, 
      amount_paid: 5000, 
      status: "active",
      deadline: "2024-11-15",
      created_at: "2024-02-20"
    },
    { 
      id: "3", 
      name: "Logo Design", 
      client: { name: "Creative Studio" } as Client,
      budget: 2000, 
      amount_paid: 2000, 
      status: "completed",
      deadline: "2024-10-01",
      created_at: "2024-03-10"
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");

  const [formData, setFormData] = useState({
    name: "",
    client_id: "",
    budget: "",
    currency_code: "USD",
    deadline: "",
    description: "",
    status: "active" as ProjectStatus,
  });

  const clients: Client[] = [
    { id: "1", name: "Acme Corp" },
    { id: "2", name: "TechStart" },
    { id: "3", name: "Creative Studio" },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const projectStatusOptions = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const getStatusBadge = (status: ProjectStatus) => {
    const variants: Record<ProjectStatus, "primary" | "success" | "warning" | "danger" | "default"> = {
      active: "primary",
      completed: "success",
      overdue: "warning",
      cancelled: "danger",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === formData.client_id);
    const newProject: Project = {
      id: String(Date.now()),
      name: formData.name,
      client_id: formData.client_id,
      client: client || undefined,
      budget: Number(formData.budget),
      amount_paid: 0,
      status: formData.status,
      deadline: formData.deadline,
      description: formData.description,
      user_id: "1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
    setFormData({ name: "", client_id: "", budget: "", currency_code: "USD", deadline: "", description: "", status: "active" });
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Projects</h1>
          <p className="text-textSecondary">Track and manage your projects</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "all")}
              options={statusOptions}
              className="w-full sm:w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Project</TableHeader>
                <TableHeader>Client</TableHeader>
                <TableHeader>Budget</TableHeader>
                <TableHeader>Paid</TableHeader>
                <TableHeader>Deadline</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="font-medium text-textPrimary">{project.name}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-textSecondary">{project.client?.name}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-textSecondary">
                      <DollarSign className="h-3 w-3 text-textMuted" />
                      {formatCurrency(project.budget, project.currency_code || 'USD')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={project.amount_paid >= project.budget ? "text-accentGreen" : "text-primary"}>
                      {formatCurrency(project.amount_paid, project.currency_code || 'USD')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-textSecondary">
                      <Calendar className="h-3 w-3" />
                      {formatDate(project.deadline)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(project.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Select
            label="Client"
            value={formData.client_id}
            onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
            options={[{ value: "", label: "Select a client" }, ...clients.map(c => ({ value: c.id, label: c.name }))]}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={`Budget (${formData.currency_code})`}
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              required
            />
            <CurrencySelect
              label="Currency"
              value={formData.currency_code}
              onChange={(e) => setFormData({ ...formData, currency_code: e.target.value })}
            />
          </div>
          <Input
            label="Deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
            options={projectStatusOptions}
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
