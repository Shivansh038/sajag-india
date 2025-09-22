import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, School, Users, TrendingUp, MapPin, 
  AlertTriangle, CheckCircle, Clock, Target,
  Filter, Download, Eye
} from "lucide-react";

const PreparednessLevels = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const schools = [
    {
      id: 1,
      name: "Delhi Public School, CP",
      location: "Central Delhi",
      students: 1250,
      preparednessScore: 92,
      completedDrills: 12,
      lastAssessment: "2 days ago",
      riskLevel: "low",
      category: "private"
    },
    {
      id: 2,
      name: "Government Senior Secondary School",
      location: "East Delhi",
      students: 890,
      preparednessScore: 78,
      completedDrills: 8,
      lastAssessment: "1 week ago",
      riskLevel: "medium",
      category: "government"
    },
    {
      id: 3,
      name: "Ryan International School",
      location: "South Delhi",
      students: 1450,
      preparednessScore: 85,
      completedDrills: 10,
      lastAssessment: "3 days ago",
      riskLevel: "low",
      category: "private"
    },
    {
      id: 4,
      name: "Kendriya Vidyalaya No. 1",
      location: "North Delhi",
      students: 1100,
      preparednessScore: 88,
      completedDrills: 11,
      lastAssessment: "1 day ago",
      riskLevel: "low",
      category: "central"
    },
    {
      id: 5,
      name: "MCD Primary School",
      location: "West Delhi",
      students: 520,
      preparednessScore: 65,
      completedDrills: 5,
      lastAssessment: "2 weeks ago",
      riskLevel: "high",
      category: "government"
    }
  ];

  const overallStats = {
    totalSchools: 125,
    totalStudents: 89750,
    avgPreparedness: 82,
    schoolsAtRisk: 23,
    completedAssessments: 102
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-alert-safe";
    if (score >= 70) return "text-alert-warning";
    return "text-alert-critical";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low": return "default";
      case "medium": return "secondary";
      case "high": return "destructive";
      default: return "outline";
    }
  };

  const filteredSchools = schools.filter(school => {
    const matchesFilter = selectedFilter === "all" || school.category === selectedFilter;
    const matchesRegion = selectedRegion === "all" || school.location.includes(selectedRegion);
    return matchesFilter && matchesRegion;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Shield className="w-5 h-5 mr-2 text-primary" />
            Preparedness Levels
          </h2>
          <p className="text-sm text-muted-foreground">
            Monitor safety preparedness across all schools
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <School className="w-6 h-6 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold">{overallStats.totalSchools}</div>
            <div className="text-xs text-muted-foreground">Total Schools</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="w-6 h-6 text-achievement mx-auto mb-1" />
            <div className="text-lg font-bold">{overallStats.totalStudents.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Students</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Target className="w-6 h-6 text-alert-safe mx-auto mb-1" />
            <div className="text-lg font-bold">{overallStats.avgPreparedness}%</div>
            <div className="text-xs text-muted-foreground">Avg Preparedness</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <AlertTriangle className="w-6 h-6 text-alert-critical mx-auto mb-1" />
            <div className="text-lg font-bold">{overallStats.schoolsAtRisk}</div>
            <div className="text-xs text-muted-foreground">At Risk Schools</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3">
          <div className="flex space-x-2 mb-2">
            <Button
              size="sm"
              variant={selectedFilter === "all" ? "default" : "outline"}
              onClick={() => setSelectedFilter("all")}
            >
              All Schools
            </Button>
            <Button
              size="sm"
              variant={selectedFilter === "government" ? "default" : "outline"}
              onClick={() => setSelectedFilter("government")}
            >
              Government
            </Button>
            <Button
              size="sm"
              variant={selectedFilter === "private" ? "default" : "outline"}
              onClick={() => setSelectedFilter("private")}
            >
              Private
            </Button>
            <Button
              size="sm"
              variant={selectedFilter === "central" ? "default" : "outline"}
              onClick={() => setSelectedFilter("central")}
            >
              Central
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schools List */}
      <div className="space-y-3">
        {filteredSchools.map((school) => (
          <Card key={school.id} className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-sm">{school.name}</h3>
                    <Badge variant={getRiskBadge(school.riskLevel)} className="text-xs">
                      {school.riskLevel} risk
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    {school.location}
                    <Users className="w-3 h-3 ml-3 mr-1" />
                    {school.students.toLocaleString()} students
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs">Preparedness Score</span>
                    <span className={`text-sm font-bold ${getScoreColor(school.preparednessScore)}`}>
                      {school.preparednessScore}%
                    </span>
                  </div>
                  <Progress value={school.preparednessScore} className="h-2 mb-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {school.completedDrills} drills completed
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Last assessed {school.lastAssessment}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Schedule Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-primary" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>High Performing Schools (85%+)</span>
              <span className="font-medium text-alert-safe">67 schools</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Needs Improvement (70-84%)</span>
              <span className="font-medium text-alert-warning">35 schools</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Requires Attention (&lt;70%)</span>
              <span className="font-medium text-alert-critical">23 schools</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Urgent Actions Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-alert-critical/10">
              <span className="text-sm">5 schools overdue for assessment</span>
              <Button size="sm" variant="outline">Review</Button>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-alert-warning/10">
              <span className="text-sm">12 schools pending drill completion</span>
              <Button size="sm" variant="outline">Schedule</Button>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-alert-info/10">
              <span className="text-sm">8 schools need resource allocation</span>
              <Button size="sm" variant="outline">Allocate</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreparednessLevels;