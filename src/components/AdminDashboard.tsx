import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, TrendingUp, Calendar, AlertTriangle, 
  CheckCircle, Clock, Target, BarChart3,
  Settings, Download, Send, Eye
} from "lucide-react";

interface AdminDashboardProps {
  userType: "teacher" | "admin";
}

const AdminDashboard = ({ userType }: AdminDashboardProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  const stats = {
    totalStudents: userType === "admin" ? 1247 : 32,
    activeDrills: 3,
    completionRate: 78,
    alertsSent: 15,
    avgPreparednessScore: 73
  };

  const recentDrills = [
    {
      id: 1,
      type: "Fire Evacuation",
      scheduledDate: "2024-01-15",
      participants: 156,
      completionRate: 94,
      status: "completed",
      avgTime: "3:45"
    },
    {
      id: 2,
      type: "Earthquake Drop Drill", 
      scheduledDate: "2024-01-10",
      participants: 203,
      completionRate: 87,
      status: "completed",
      avgTime: "2:15"
    },
    {
      id: 3,
      type: "Flood Evacuation",
      scheduledDate: "2024-01-20", 
      participants: 0,
      completionRate: 0,
      status: "scheduled",
      avgTime: "-"
    }
  ];

  const classPerformance = [
    { class: "Class 10-A", students: 32, completionRate: 94, avgScore: 85 },
    { class: "Class 10-B", students: 30, completionRate: 87, avgScore: 78 },
    { class: "Class 11-A", students: 28, completionRate: 75, avgScore: 72 },
    { class: "Class 11-B", students: 31, completionRate: 68, avgScore: 65 }
  ];

  const upcomingEvents = [
    { date: "Jan 20", event: "Flood Evacuation Drill", type: "drill" },
    { date: "Jan 25", event: "Fire Safety Training", type: "training" },
    { date: "Feb 01", event: "Emergency Response Workshop", type: "workshop" },
    { date: "Feb 10", event: "Monthly Safety Assessment", type: "assessment" }
  ];

  const handleScheduleDrill = () => {
    console.log("Schedule new drill");
  };

  const handleSendAlert = () => {
    console.log("Send safety alert");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-alert-safe";
      case "scheduled": return "text-alert-info";
      case "overdue": return "text-alert-critical";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "scheduled": return "secondary";
      case "overdue": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary" />
            {userType === "admin" ? "Admin" : "Teacher"} Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Safety program management and analytics
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold">{stats.totalStudents}</div>
            <div className="text-xs text-muted-foreground">
              {userType === "admin" ? "Total Students" : "My Students"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Target className="w-6 h-6 text-achievement mx-auto mb-1" />
            <div className="text-lg font-bold">{stats.completionRate}%</div>
            <div className="text-xs text-muted-foreground">Drill Completion</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <TrendingUp className="w-6 h-6 text-alert-safe mx-auto mb-1" />
            <div className="text-lg font-bold">{stats.avgPreparednessScore}%</div>
            <div className="text-xs text-muted-foreground">Avg Safety Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <AlertTriangle className="w-6 h-6 text-alert-warning mx-auto mb-1" />
            <div className="text-lg font-bold">{stats.alertsSent}</div>
            <div className="text-xs text-muted-foreground">Alerts Sent</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              onClick={handleScheduleDrill}
              className="h-auto p-3 flex flex-col"
            >
              <Calendar className="w-5 h-5 mb-1" />
              <span className="text-xs">Schedule Drill</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleSendAlert}
              className="h-auto p-3 flex flex-col"
            >
              <Send className="w-5 h-5 mb-1" />
              <span className="text-xs">Send Alert</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="h-auto p-3 flex flex-col"
            >
              <Download className="w-5 h-5 mb-1" />
              <span className="text-xs">Export Report</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="h-auto p-3 flex flex-col"
            >
              <Eye className="w-5 h-5 mb-1" />
              <span className="text-xs">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Drills */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Drills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentDrills.map((drill) => (
            <div key={drill.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium">{drill.type}</h4>
                  <Badge variant={getStatusBadge(drill.status)} className="text-xs">
                    {drill.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {drill.scheduledDate} • {drill.participants > 0 ? `${drill.participants} participants` : "Not started"}
                  {drill.avgTime !== "-" && ` • Avg time: ${drill.avgTime}`}
                </p>
              </div>
              <div className="text-right">
                {drill.completionRate > 0 && (
                  <div className="text-sm font-medium">{drill.completionRate}%</div>
                )}
                <CheckCircle 
                  className={`w-4 h-4 ${getStatusColor(drill.status)}`} 
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Class Performance (for teachers) */}
      {userType === "teacher" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Class Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {classPerformance.slice(0, 2).map((classData, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{classData.class}</span>
                  <span className="text-muted-foreground">
                    {classData.students} students
                  </span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Completion Rate</span>
                  <span>{classData.completionRate}%</span>
                </div>
                <Progress value={classData.completionRate} className="h-2" />
                <div className="flex justify-between text-xs">
                  <span>Avg Safety Score</span>
                  <span className="font-medium">{classData.avgScore}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {upcomingEvents.slice(0, 3).map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                <div className="text-center min-w-0">
                  <div className="text-xs font-medium">{event.date}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{event.event}</p>
                  <p className="text-xs text-muted-foreground capitalize">{event.type}</p>
                </div>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System-wide Performance (for admins) */}
      {userType === "admin" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Institution Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Teachers</span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Classes Managed</span>
                <span className="font-medium">28</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Safety Compliance</span>
                <span className="font-medium text-alert-safe">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly Drills Conducted</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;