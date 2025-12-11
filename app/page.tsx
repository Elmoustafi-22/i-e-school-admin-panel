"use client"

import { useEffect, useState, useCallback } from "react"
import { BookOpen, Users, ClipboardCheck, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Student, Class } from "@/lib/types" // Assuming Student and Class types are available

// Type for a single recent activity item
type RecentActivityItem = {
  id: string;
  type: 'student' | 'class';
  action: string;
  detail: string;
  createdAt: string; // ISO string for sorting
};

// Helper function to format time ago
const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30); // Approximate
  const years = Math.round(days / 365); // Approximate

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 30) {
    return `${days} days ago`;
  } else if (months < 12) {
    return `${months} months ago`;
  } else {
    return `${years} years ago`;
  }
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    attendancePercentage: 0,
    presentStudents: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // --- Fetch main stats data ---
      const [activeStudentsRes, classesRes, attendanceRes, allStudentsRes] = await Promise.all([
        fetch('/api/students?status=Active'), // For stats
        fetch('/api/classes'),                 // For stats and recent activities
        fetch(`/api/attendance?date=${today}&status=Present`),
        fetch('/api/students'),                // For recent activities
      ]);

      if (!activeStudentsRes.ok || !classesRes.ok || !attendanceRes.ok || !allStudentsRes.ok) {
        throw new Error('Failed to fetch some dashboard data');
      }

      const activeStudents = await activeStudentsRes.json();
      const allClasses: Class[] = await classesRes.json();
      const presentRecords = await attendanceRes.json();
      const allStudentsForActivity: Student[] = await allStudentsRes.json();
      
      const totalStudents = activeStudents.length;
      const totalClasses = allClasses.length;

      // Get unique present students
      const presentStudentIds = new Set(presentRecords.map((r: any) => r.studentId));
      const presentStudents = presentStudentIds.size;
      
      const attendancePercentage = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;

      setStats({
        totalStudents,
        totalClasses,
        attendancePercentage,
        presentStudents
      });

      // --- Process recent activities ---
      const studentActivities: RecentActivityItem[] = allStudentsForActivity.map((student: Student) => ({
        id: student._id,
        type: 'student',
        action: 'New student enrolled',
        detail: `${student.name} - ${student.className}`,
        createdAt: student.createdAt,
      }));

      const classActivities: RecentActivityItem[] = allClasses.map((cls: Class) => ({
        id: cls._id,
        type: 'class',
        action: 'New class created',
        detail: cls.name,
        createdAt: cls.createdAt,
      }));

      const combinedActivities = [...studentActivities, ...classActivities]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5); // Limit to 5 recent activities

      setRecentActivities(combinedActivities);

    } catch (error: any) {
      setError(error.message || 'Failed to load dashboard data. Please try refreshing the page.');
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="mt-2 text-muted-foreground">Welcome to the i-eSchool Admin Panel</p>
      </div>

      {/* Developer Notes */}
      <Alert className="border-primary/50 bg-primary/5">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          <strong className="font-semibold text-foreground">Developer Notes:</strong>
          <span className="text-muted-foreground">
            {" "}
            This frontend is for an interview exercise. Candidates should complete a minimum of{" "}
            <strong>1 of the following 3 tasks:</strong>
          </span>
          <ul className="mt-2 ml-4 list-disc space-y-1 text-muted-foreground">
            <li>Replace mock data with a real database (PostgreSQL, MongoDB, etc.)</li>
            <li>Implement a Microsoft Teams webhook endpoint to send messages from the Teams Integration page</li>
            <li>Build real APIs for classes, students, and attendance (REST or GraphQL)</li>
          </ul>
        </AlertDescription>
      </Alert>

      {error && <Alert variant="destructive">{error}</Alert>}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-[126px]" />
            <Skeleton className="h-[126px]" />
            <Skeleton className="h-[126px]" />
            <Skeleton className="h-[126px]" />
          </>
        ) : (
          <>
            <StatCard title="Total Students" value={stats.totalStudents} icon={Users} description="Active students" />
            <StatCard title="Total Classes" value={stats.totalClasses} icon={BookOpen} description="Ongoing courses" />
            <StatCard 
              title="Today's Attendance" 
              value={`${stats.attendancePercentage}%`} 
              icon={ClipboardCheck} 
              description={`${stats.presentStudents} of ${stats.totalStudents} present`} 
            />
            <StatCard title="Avg. Performance" value="84%" icon={TrendingUp} description="This semester" />
          </>
        )}
      </div>

      {/* Quick Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.action}</p>
                      <p className="text-muted-foreground">{item.detail}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{timeAgo(item.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No recent activity.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-lg border border-border p-3 hover:bg-accent/50 cursor-pointer transition-colors">
                <p className="font-medium text-foreground">Mark Today's Attendance</p>
                <p className="text-sm text-muted-foreground">Record student attendance for all classes</p>
              </div>
              <div className="rounded-lg border border-border p-3 hover:bg-accent/50 cursor-pointer transition-colors">
                <p className="font-medium text-foreground">Generate AI Summary</p>
                <p className="text-sm text-muted-foreground">Get AI-powered insights on attendance</p>
              </div>
              <div className="rounded-lg border border-border p-3 hover:bg-accent/50 cursor-pointer transition-colors">
                <p className="font-medium text-foreground">Send Teams Message</p>
                <p className="text-sm text-muted-foreground">Notify staff via Microsoft Teams</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
