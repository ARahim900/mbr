import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Shield, Search, Filter, AlertTriangle, CheckCircle, Clock, 
  Calendar,
  MapPin, Battery, Signal
} from 'lucide-react';
import MetricCard from '../ui/MetricCard';
import ChartCard from '../ui/ChartCard';
import Button from '../ui/Button';

// Firefighting and Alarm System Data
const firefightingData = [
  {
    id: 'FF-001',
    zone: 'Zone FM',
    building: 'FM Building',
    systemType: 'Fire Alarm Panel',
    equipment: 'Main Fire Alarm Control Panel',
    manufacturer: 'Notifier',
    model: 'NFS2-3030',
    installDate: '2022-01-15',
    lastMaintenance: '2024-12-01',
    nextMaintenance: '2025-03-01',
    status: 'Operational',
    batteryLevel: 95,
    signalStrength: 'Strong',
    priority: 'Critical',
    inspector: 'Bahwan Engineering',
    notes: 'All zones functioning properly'
  },
  {
    id: 'FF-002',
    zone: 'Zone 01',
    building: 'B1 Building',
    systemType: 'Smoke Detector',
    equipment: 'Optical Smoke Detector',
    manufacturer: 'Edwards',
    model: 'SIGA-PS',
    installDate: '2022-02-10',
    lastMaintenance: '2024-11-15',
    nextMaintenance: '2025-02-15',
    status: 'Needs Attention',
    batteryLevel: 78,
    signalStrength: 'Weak',
    priority: 'High',
    inspector: 'Bahwan Engineering',
    notes: 'Signal interference detected - requires investigation'
  },
  {
    id: 'FF-003',
    zone: 'Zone 02',
    building: 'B2 Building',
    systemType: 'Fire Suppression',
    equipment: 'Sprinkler System Zone 1',
    manufacturer: 'Tyco',
    model: 'TY-FRB',
    installDate: '2022-01-20',
    lastMaintenance: '2024-12-10',
    nextMaintenance: '2025-06-10',
    status: 'Operational',
    batteryLevel: 100,
    signalStrength: 'Strong',
    priority: 'Critical',
    inspector: 'Bahwan Engineering',
    notes: 'Pressure test completed - all valves operational'
  },
  {
    id: 'FF-004',
    zone: 'Zone 03A',
    building: 'D44 Building',
    systemType: 'Fire Extinguisher',
    equipment: 'CO2 Fire Extinguisher',
    manufacturer: 'Kidde',
    model: 'ProLine 5BC',
    installDate: '2023-03-01',
    lastMaintenance: '2024-09-01',
    nextMaintenance: '2025-03-01',
    status: 'Expired',
    batteryLevel: 0,
    signalStrength: 'N/A',
    priority: 'Medium',
    inspector: 'Bahwan Engineering',
    notes: 'Requires immediate recharging and recertification'
  },
  {
    id: 'FF-005',
    zone: 'Zone 03B',
    building: 'D45 Building',
    systemType: 'Emergency Lighting',
    equipment: 'LED Emergency Exit Sign',
    manufacturer: 'Cooper',
    model: 'APEL',
    installDate: '2022-04-15',
    lastMaintenance: '2024-10-20',
    nextMaintenance: '2025-01-20',
    status: 'Operational',
    batteryLevel: 88,
    signalStrength: 'Strong',
    priority: 'Medium',
    inspector: 'Bahwan Engineering',
    notes: 'Battery backup tested - 3 hour duration confirmed'
  },
  {
    id: 'FF-006',
    zone: 'Sales Center',
    building: 'Sales Center',
    systemType: 'Fire Alarm Panel',
    equipment: 'Addressable Fire Panel',
    manufacturer: 'Honeywell',
    model: 'FACP-HC',
    installDate: '2021-12-01',
    lastMaintenance: '2024-11-30',
    nextMaintenance: '2025-02-28',
    status: 'Operational',
    batteryLevel: 92,
    signalStrength: 'Strong',
    priority: 'Critical',
    inspector: 'Bahwan Engineering',
    notes: 'Recent software update completed'
  },
  {
    id: 'FF-007',
    zone: 'Zone FM',
    building: 'Pump Room',
    systemType: 'Fire Pump',
    equipment: 'Diesel Fire Pump',
    manufacturer: 'Grundfos',
    model: 'NK 200-400',
    installDate: '2022-01-10',
    lastMaintenance: '2024-12-05',
    nextMaintenance: '2025-03-05',
    status: 'Operational',
    batteryLevel: 100,
    signalStrength: 'Strong',
    priority: 'Critical',
    inspector: 'Bahwan Engineering',
    notes: 'Weekly run test completed - 45 PSI maintained'
  },
  {
    id: 'FF-008',
    zone: 'Zone 05',
    building: 'B5 Building',
    systemType: 'Heat Detector',
    equipment: 'Rate of Rise Heat Detector',
    manufacturer: 'Hochiki',
    model: 'DCD-1E',
    installDate: '2022-05-20',
    lastMaintenance: '2024-08-15',
    nextMaintenance: '2025-02-15',
    status: 'Maintenance Due',
    batteryLevel: 65,
    signalStrength: 'Moderate',
    priority: 'High',
    inspector: 'Bahwan Engineering',
    notes: 'Sensitivity calibration required'
  }
];

// System Types for filtering
const systemTypes = ['All', 'Fire Alarm Panel', 'Smoke Detector', 'Fire Suppression', 'Fire Extinguisher', 'Emergency Lighting', 'Fire Pump', 'Heat Detector'];

// Status options
const statusOptions = ['All', 'Operational', 'Needs Attention', 'Maintenance Due', 'Expired'];

const FirefightingAlarmModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [systemTypeFilter, setSystemTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedZone, setSelectedZone] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Get unique zones
  const zones = useMemo(() => {
    const uniqueZones = [...new Set(firefightingData.map(item => item.zone))];
    return ['All', ...uniqueZones];
  }, []);

  // Filter and search data
  const filteredData = useMemo(() => {
    return firefightingData.filter(item => {
      const matchesSearch = Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesSystemType = systemTypeFilter === 'All' || item.systemType === systemTypeFilter;
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesZone = selectedZone === 'All' || item.zone === selectedZone;
      
      return matchesSearch && matchesSystemType && matchesStatus && matchesZone;
    });
  }, [searchTerm, systemTypeFilter, statusFilter, selectedZone]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Statistics
  const stats = useMemo(() => {
    const total = firefightingData.length;
    const operational = firefightingData.filter(item => item.status === 'Operational').length;
    const needsAttention = firefightingData.filter(item => item.status === 'Needs Attention').length;
    const maintenanceDue = firefightingData.filter(item => item.status === 'Maintenance Due').length;
    const expired = firefightingData.filter(item => item.status === 'Expired').length;
    const critical = firefightingData.filter(item => item.priority === 'Critical').length;
    
    return {
      total,
      operational,
      needsAttention,
      maintenanceDue,
      expired,
      critical,
      operational_percentage: ((operational / total) * 100).toFixed(1)
    };
  }, []);

  // Chart data
  const statusChartData = [
    { name: 'Operational', value: stats.operational, color: '#10B981' },
    { name: 'Needs Attention', value: stats.needsAttention, color: '#F59E0B' },
    { name: 'Maintenance Due', value: stats.maintenanceDue, color: '#EF4444' },
    { name: 'Expired', value: stats.expired, color: '#6B7280' }
  ];

  const systemTypeChartData = useMemo(() => {
    const typeCount = systemTypes.slice(1).map(type => ({
      name: type,
      count: firefightingData.filter(item => item.systemType === type).length
    }));
    return typeCount.filter(item => item.count > 0);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational': return 'text-green-600 bg-green-100';
      case 'Needs Attention': return 'text-yellow-600 bg-yellow-100';
      case 'Maintenance Due': return 'text-orange-600 bg-orange-100';
      case 'Expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level >= 80) return 'text-green-600';
    if (level >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSignalColor = (strength: string) => {
    switch (strength) {
      case 'Strong': return 'text-green-600';
      case 'Moderate': return 'text-yellow-600';
      case 'Weak': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg">
          <Shield size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Firefighting & Alarm System Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and maintain fire safety equipment across all zones</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Equipment"
          value={stats.total.toString()}
          unit="systems"
          icon={Shield}
          subtitle="All fire safety equipment"
          iconColor="text-red-600"
        />
        <MetricCard
          title="Operational"
          value={stats.operational_percentage}
          unit="%"
          icon={CheckCircle}
          subtitle={`${stats.operational} of ${stats.total} systems`}
          iconColor="text-green-600"
        />
        <MetricCard
          title="Critical Priority"
          value={stats.critical.toString()}
          unit="systems"
          icon={AlertTriangle}
          subtitle="Requires immediate attention"
          iconColor="text-red-600"
        />
        <MetricCard
          title="Maintenance Due"
          value={stats.maintenanceDue.toString()}
          unit="systems"
          icon={Clock}
          subtitle="Scheduled maintenance needed"
          iconColor="text-orange-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="System Status Distribution" subtitle="Current status of all fire safety systems">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} systems`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Equipment by Type" subtitle="Distribution of fire safety equipment types">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={systemTypeChartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`${value} systems`, 'Count']} />
              <Bar dataKey="count" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Filters */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Search Equipment
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by equipment, building, etc." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-gray-50/50 dark:bg-gray-700/50 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Zone
            </label>
            <select 
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-gray-50/50 dark:bg-gray-700/50"
            >
              {zones.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              System Type
            </label>
            <select 
              value={systemTypeFilter}
              onChange={(e) => setSystemTypeFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-gray-50/50 dark:bg-gray-700/50"
            >
              {systemTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-gray-50/50 dark:bg-gray-700/50"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <Button variant="secondary" className="h-12">
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Fire Safety Equipment</h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {paginatedData.length} of {filteredData.length} systems
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-700/50">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Equipment</th>
                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Location</th>
                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Priority</th>
                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Battery</th>
                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Signal</th>
                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Next Maintenance</th>
                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Inspector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent dark:hover:from-gray-700/30 dark:hover:to-transparent transition-all duration-200">
                  <td className="p-4">
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{item.equipment}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{item.systemType}</div>
                      <div className="text-xs text-gray-500">{item.manufacturer} {item.model}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{item.building}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{item.zone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    {item.batteryLevel > 0 ? (
                      <div className="flex items-center gap-2">
                        <Battery className={`w-4 h-4 ${getBatteryColor(item.batteryLevel)}`} />
                        <span className={`font-medium ${getBatteryColor(item.batteryLevel)}`}>
                          {item.batteryLevel}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="p-4">
                    {item.signalStrength !== 'N/A' ? (
                      <div className="flex items-center gap-2">
                        <Signal className={`w-4 h-4 ${getSignalColor(item.signalStrength)}`} />
                        <span className={`font-medium ${getSignalColor(item.signalStrength)}`}>
                          {item.signalStrength}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(item.nextMaintenance).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.inspector}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirefightingAlarmModule; 