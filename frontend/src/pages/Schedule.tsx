import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { SkeletonCard } from "../components/ui/Skeleton";
import { Plus, Clock, CheckCircle2, Calendar, AlertCircle } from "lucide-react";
import { formatDate, formatDateRelative } from "../lib/utils";
import type { Reminder, ReminderType } from "../types";

export function Schedule() {
  const [loading, setLoading] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([
    { 
      id: "1", 
      title: "Website Redesign deadline", 
      description: "Complete final review and deliver to client",
      reminder_type: "deadline", 
      due_date: "2024-12-31",
      is_completed: false,
      created_at: "2024-11-01"
    },
    { 
      id: "2", 
      title: "Follow up with TechStart", 
      description: "Send project proposal and pricing",
      reminder_type: "follow_up", 
      due_date: "2024-11-20",
      is_completed: false,
      created_at: "2024-11-15"
    },
    { 
      id: "3", 
      title: "Payment due from Acme Corp", 
      description: "$2,500 pending payment",
      reminder_type: "payment", 
      due_date: "2024-11-18",
      is_completed: true,
      created_at: "2024-11-10"
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reminder_type: "custom" as ReminderType,
    due_date: "",
  });

  const reminderTypeOptions = [
    { value: "deadline", label: "Project Deadline" },
    { value: "payment", label: "Payment Due" },
    { value: "follow_up", label: "Follow Up" },
    { value: "custom", label: "Custom Reminder" },
  ];

  const filteredReminders = reminders.filter(reminder => {
    if (filter === "pending") return !reminder.is_completed;
    if (filter === "completed") return reminder.is_completed;
    return true;
  }).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  const getTypeIcon = (type: ReminderType) => {
    switch (type) {
      case "deadline": return <Calendar className="h-5 w-5 text-primary" />;
      case "payment": return <AlertCircle className="h-5 w-5 text-error" />;
      case "follow_up": return <Clock className="h-5 w-5 text-accentGreen" />;
      default: return <Clock className="h-5 w-5 text-textSecondary" />;
    }
  };

  const getTypeBadge = (type: ReminderType) => {
    const labels: Record<ReminderType, string> = {
      deadline: "Deadline",
      payment: "Payment",
      follow_up: "Follow Up",
      custom: "Custom",
    };
    return <Badge variant="default">{labels[type]}</Badge>;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReminder: Reminder = {
      id: String(Date.now()),
      user_id: "1",
      title: formData.title,
      description: formData.description,
      reminder_type: formData.reminder_type,
      due_date: formData.due_date,
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setReminders([...reminders, newReminder]);
    setFormData({ title: "", description: "", reminder_type: "custom", due_date: "" });
    setIsModalOpen(false);
  };

  const toggleComplete = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, is_completed: !r.is_completed } : r
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Schedule & Reminders</h1>
          <p className="text-textSecondary">Stay on top of deadlines and tasks</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === f
                ? "bg-primary text-white shadow-glow-sm"
                : "bg-sidebar text-textSecondary hover:bg-card hover:text-textPrimary border border-border"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {filteredReminders.map((reminder) => (
          <Card key={reminder.id} hover={false} className={reminder.is_completed ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl ${
                  reminder.reminder_type === "deadline" ? "bg-primary/20" :
                  reminder.reminder_type === "payment" ? "bg-error/20" :
                  reminder.reminder_type === "follow_up" ? "bg-accentGreen/20" : "bg-sidebar"
                }`}>
                  {getTypeIcon(reminder.reminder_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${reminder.is_completed ? "line-through text-textMuted" : "text-textPrimary"}`}>
                          {reminder.title}
                        </h3>
                        {getTypeBadge(reminder.reminder_type)}
                      </div>
                      {reminder.description && (
                        <p className="text-sm text-textSecondary mt-1">{reminder.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => toggleComplete(reminder.id)}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        reminder.is_completed
                          ? "text-accentGreen bg-accentGreen/20"
                          : "text-textMuted hover:text-accentGreen hover:bg-accentGreen/20"
                      }`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className={`flex items-center gap-1 ${
                      new Date(reminder.due_date) < new Date() && !reminder.is_completed
                        ? "text-error"
                        : "text-textSecondary"
                    }`}>
                      <Calendar className="h-3 w-3" />
                      {formatDate(reminder.due_date)}
                      <span className="text-xs text-textMuted">({formatDateRelative(reminder.due_date)})</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredReminders.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 text-textMuted mx-auto mb-4" />
              <p className="text-textSecondary">No reminders found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Reminder Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Reminder"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Select
            label="Type"
            value={formData.reminder_type}
            onChange={(e) => setFormData({ ...formData, reminder_type: e.target.value as ReminderType })}
            options={reminderTypeOptions}
          />
          <Input
            label="Due Date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            required
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Reminder</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
