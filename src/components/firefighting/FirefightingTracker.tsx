'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, Clock, Filter, Flame, Search } from 'lucide-react';
import { firefightingData } from '@/data/firefightingData';
import { PPMRecord, FirefightingStats, PPMSummary } from '@/types/firefighting';

const COLORS = {
  completed: '#10b981',
  pending: '#f59e0b',
  inProgress: '#3b82f6',
  danger: '#ef4444',
  warning: '#f97316',
  success: '#22c55e',
  info: '#6366f1'
};

export default function FirefightingTracker() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique periods from data
  const periods = useMemo(() => {
    const allPeriods = new Set<string>();
    firefightingData.forEach(record => {
      record.periods.forEach(period => {
        allPeriods.add(period.date);
      });
    });
    return Array.from(allPeriods).sort();
  }, []);

  // Calculate statistics
  const stats = useMemo<FirefightingStats>(() => {
    let totalLocations = firefightingData.length;
    let completedPPMs = 0;
    let pendingPPMs = 0;
    let findingsRequiringAction = 0;

    firefightingData.forEach(record => {
      record.periods.forEach(period => {
        if (selectedPeriod === 'all' || period.date === selectedPeriod) {
          if (period.status === 'PPM Completed') completedPPMs++;
          if (period.status === 'PPM Pending') pendingPPMs++;
          if (period.findings && period.findingsStatus.includes('Waiting for approval')) {
            findingsRequiringAction++;
          }
        }
      });
    });

    return { totalLocations, completedPPMs, pendingPPMs, findingsRequiringAction };
  }, [selectedPeriod]);

  // Get summary by period
  const periodSummary = useMemo<PPMSummary[]>(() => {
    return periods.map(period => {
      let completed = 0;
      let pending = 0;
      let inProgress = 0;

      firefightingData.forEach(record => {
        const periodData = record.periods.find(p => p.date === period);
        if (periodData) {
          if (periodData.status === 'PPM Completed') completed++;
          else if (periodData.status === 'PPM Pending') pending++;
          else if (periodData.status === 'PPM In Progress') inProgress++;
        }
      });

      return {
        period,
        completed,
        pending,
        inProgress,
        total: completed + pending + inProgress
      };
    });
  }, [periods]);

  // Filter data based on search and location
  const filteredData = useMemo(() => {
    return firefightingData.filter(record => {
      const matchesSearch = searchTerm === '' || 
        record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.equipment.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = selectedLocation === 'all' || 
        record.location.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesLocation;
    });
  }, [searchTerm, selectedLocation]);

  // Get unique locations for filter
  const locations = useMemo(() => {
    const uniqueLocations = new Set<string>();
    firefightingData.forEach(record => {
      // Extract zone or building type from location
      if (record.location.includes('Zone')) {
        uniqueLocations.add('Zone');
      } else if (record.location.includes('Staff Accommodation')) {
        uniqueLocations.add('Staff Accommodation');
      } else if (record.location.includes('Villa')) {
        uniqueLocations.add('Villa');
      } else {
        uniqueLocations.add('Other');
      }
    });
    return Array.from(uniqueLocations);
  }, []);

  // Pie chart data for current status
  const statusDistribution = useMemo(() => {
    const currentPeriod = selectedPeriod === 'all' ? periods[periods.length - 1] : selectedPeriod;
    let completed = 0;
    let pending = 0;
    let withFindings = 0;

    firefightingData.forEach(record => {
      const periodData = record.periods.find(p => p.date === currentPeriod);
      if (periodData) {
        if (periodData.status === 'PPM Completed') {
          completed++;
          if (periodData.findings) withFindings++;
        } else if (periodData.status === 'PPM Pending') {
          pending++;
        }
      }
    });

    return [
      { name: 'Completed', value: completed, fill: COLORS.completed },
      { name: 'Pending', value: pending, fill: COLORS.pending },
      { name: 'With Findings', value: withFindings, fill: COLORS.warning }
    ];
  }, [selectedPeriod, periods]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flame className="h-8 w-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold">Firefighting & Alarm System Tracker</h1>
            <p className="text-muted-foreground">Manage PPM schedules and track system findings</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              {periods.map(period => (
                <SelectItem key={period} value={period}>{period}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLocations}</div>
            <p className="text-xs text-muted-foreground">Active monitoring sites</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed PPMs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedPPMs}</div>
            <p className="text-xs text-muted-foreground">
              {selectedPeriod === 'all' ? 'All time' : selectedPeriod}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending PPMs</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPPMs}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Findings Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.findingsRequiringAction}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>PPM Status Over Time</CardTitle>
            <CardDescription>Track maintenance completion trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={periodSummary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke={COLORS.completed} 
                  strokeWidth={2} 
                  name="Completed"
                />
                <Line 
                  type="monotone" 
                  dataKey="pending" 
                  stroke={COLORS.pending} 
                  strokeWidth={2} 
                  name="Pending"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Status Distribution</CardTitle>
            <CardDescription>Overview of system status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tracker" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tracker">PPM Tracker</TabsTrigger>
          <TabsTrigger value="findings">Findings Report</TabsTrigger>
          <TabsTrigger value="equipment">Equipment Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>PPM Schedule & Status</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search locations..."
                      className="pl-8 pr-4 py-2 border rounded-md"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map(loc => (
                        <SelectItem key={loc} value={loc.toLowerCase()}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Equipment</TableHead>
                      {periods.slice(-4).map(period => (
                        <TableHead key={period} className="text-center">{period}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.location}</TableCell>
                        <TableCell>{record.equipment}</TableCell>
                        {periods.slice(-4).map(period => {
                          const periodData = record.periods.find(p => p.date === period);
                          return (
                            <TableCell key={period} className="text-center">
                              {periodData && (
                                <Badge 
                                  variant={
                                    periodData.status === 'PPM Completed' ? 'success' :
                                    periodData.status === 'PPM Pending' ? 'warning' : 'default'
                                  }
                                  className="text-xs"
                                >
                                  {periodData.status.replace('PPM ', '')}
                                  {periodData.findings && ' ⚠'}
                                </Badge>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="findings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Findings & Issues</CardTitle>
              <CardDescription>Equipment and parts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {firefightingData.map(record => {
                  const activeFindings = record.periods
                    .filter(p => p.findings && p.findingsStatus.includes('Waiting'))
                    .map(p => ({ ...p, location: record.location, equipment: record.equipment }));

                  return activeFindings.map((finding, idx) => (
                    <div key={`${record.id}-${idx}`} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-semibold">{finding.location}</h4>
                            <p className="text-sm text-muted-foreground">{finding.equipment}</p>
                          </div>
                          <div className="text-sm space-y-1">
                            {finding.findings.split('\n').map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {finding.date}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {finding.findingsStatus}
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Update Status
                        </Button>
                      </div>
                    </div>
                  ));
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Distribution</CardTitle>
              <CardDescription>Overview of firefighting equipment across locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Fire Alarm System', 'Fire Hose reel', 'Fire Pump', 'Fire Extinguisher'].map(equipment => {
                  const count = firefightingData.filter(record => 
                    record.equipment.includes(equipment)
                  ).length;
                  
                  return (
                    <div key={equipment} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-md">
                          <Flame className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-medium">{equipment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{count}</span>
                        <span className="text-sm text-muted-foreground">locations</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
