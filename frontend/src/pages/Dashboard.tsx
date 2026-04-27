import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { SkeletonCard } from "../components/ui/Skeleton";
import { 
  DollarSign, 
  Users, 
  Briefcase, 
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { useState, useEffect } from "react";
import type { DashboardStats, MonthlyEarning, Project, Reminder } from "../types";

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-textSecondary">{title}</p>
            <p className="text-2xl font-bold text-textPrimary mt-1">{value}</p>
            {trend && (
              <p className="text-sm text-accentGreen mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    // Simulate data loading - replace with API calls
    setTimeout(() => {
      setStats({
        totalRevenue: 125000,
        pendingPayments: 15000,
        activeProjects: 8,
        overdueProjects: 2,
        totalClients: 12,
      });
      setRecentProjects([
        { 
          id: "1", 
          name: "Website Redesign", 
          client: { name: "Acme Corp" }, 
          budget: 5000, 
          amount_paid: 2500, 
          status: "active",
          deadline: "2024-12-31"
        } as Project,
        { 
          id: "2", 
          name: "Mobile App", 
          client: { name: "TechStart" }, 
          budget: 15000, 
          amount_paid: 5000, 
          status: "active",
          deadline: "2024-11-15"
        } as Project,
        { 
          id: "3", 
          name: "Logo Design", 
          client: { name: "Creative Studio" }, 
          budget: 2000, 
          amount_paid: 2000, 
          status: "completed",
          deadline: "2024-10-01"
        } as Project,
      ]);
      setUpcomingReminders([
        { id: "1", title: "Project deadline", due_date: "2024-11-20", reminder_type: "deadline" } as Reminder,
        { id: "2", title: "Follow up with client", due_date: "2024-11-18", reminder_type: "follow_up" } as Reminder,
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Dashboard</h1>
        <p className="text-textSecondary">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={DollarSign}
          trend="+12% this month"
          color="bg-primary/20 text-primary"
        />
        <StatCard
          title="Active Projects"
          value={stats?.activeProjects || 0}
          icon={Briefcase}
          color="bg-sidebar text-textSecondary"
        />
        <StatCard
          title="Total Clients"
          value={stats?.totalClients || 0}
          icon={Users}
          trend="+2 new this month"
          color="bg-accentGreen/20 text-accentGreen"
        />
        <StatCard
          title="Pending Payments"
          value={formatCurrency(stats?.pendingPayments || 0)}
          icon={AlertCircle}
          color="bg-error/20 text-error"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-sidebar rounded-xl border border-border hover:border-primary/30 transition-all duration-300">
                  <div>
                    <p className="font-medium text-textPrimary">{project.name}</p>
                    <p className="text-sm text-textSecondary">{project.client?.name}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={project.status === "completed" ? "success" : "primary"}>
                      {project.status}
                    </Badge>
                    <p className="text-sm text-textMuted mt-1">
                      {formatCurrency(project.amount_paid)} / {formatCurrency(project.budget)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-start gap-3 p-3 bg-sidebar rounded-xl border border-border hover:border-primary/30 transition-all duration-300">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-textPrimary">{reminder.title}</p>
                    <p className="text-sm text-textSecondary">
                      Due: {new Date(reminder.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-textMuted cursor-pointer hover:text-accentGreen transition-colors" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
