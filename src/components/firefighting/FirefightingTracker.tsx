import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  Users,
  FileText
} from 'lucide-react';
import ModuleNavigation from '../../components/ui/ModuleNavigation';
import Card from '../../components/Card';

const sections = [
  { id: 'overview', name: 'Overview', icon: Shield },
  { id: 'alarms', name: 'Fire Alarms', icon: AlertTriangle },
  { id: 'equipment', name: 'Equipment', icon: CheckCircle },
  { id: 'maintenance', name: 'Maintenance', icon: Clock },
  { id: 'reports', name: 'Reports', icon: FileText }
];

const FirefightingTracker: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'alarms':
        return <AlarmsSection />;
      case 'equipment':
        return <EquipmentSection />;
      case 'maintenance':
        return <MaintenanceSection />;
      case 'reports':
        return <ReportsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Firefighting & Alarm System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Monitor and manage fire safety equipment, alarms, and maintenance schedules
        </p>
      </div>

      <ModuleNavigation 
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

const OverviewSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <Card
      title="Total Fire Alarms"
      value="48"
      icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
      trend={{ value: 2, isPositive: false }}
      className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
    />
    <Card
      title="Active Alarms"
      value="0"
      icon={<AlertTriangle className="h-6 w-6 text-green-500" />}
      className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
    />
    <Card
      title="Equipment Status"
      value="95%"
      icon={<CheckCircle className="h-6 w-6 text-blue-500" />}
      trend={{ value: 3, isPositive: true }}
      className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
    />
    <Card
      title="Next Maintenance"
      value="5 Days"
      icon={<Clock className="h-6 w-6 text-yellow-500" />}
      className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20"
    />
  </div>
);

const AlarmsSection = () => (
  <div className="space-y-6">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Fire Alarm Status</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="pb-3 text-gray-600 dark:text-gray-300">Location</th>
              <th className="pb-3 text-gray-600 dark:text-gray-300">Status</th>
              <th className="pb-3 text-gray-600 dark:text-gray-300">Last Test</th>
              <th className="pb-3 text-gray-600 dark:text-gray-300">Battery</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            <tr>
              <td className="py-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                Building A - Floor 1
              </td>
              <td className="py-3">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
              </td>
              <td className="py-3 text-gray-600 dark:text-gray-300">2 days ago</td>
              <td className="py-3 text-gray-600 dark:text-gray-300">98%</td>
            </tr>
            <tr>
              <td className="py-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                Building A - Floor 2
              </td>
              <td className="py-3">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
              </td>
              <td className="py-3 text-gray-600 dark:text-gray-300">2 days ago</td>
              <td className="py-3 text-gray-600 dark:text-gray-300">95%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const EquipmentSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Fire Extinguishers</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">Total Units</span>
          <span className="font-semibold">125</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">Expired</span>
          <span className="font-semibold text-red-600">3</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">Due for Service</span>
          <span className="font-semibold text-yellow-600">12</span>
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Sprinkler Systems</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">Total Zones</span>
          <span className="font-semibold">24</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">Active</span>
          <span className="font-semibold text-green-600">24</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">Last Inspection</span>
          <span className="font-semibold">15 days ago</span>
        </div>
      </div>
    </div>
  </div>
);

const MaintenanceSection = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Upcoming Maintenance</h2>
    <div className="space-y-4">
      <div className="border-l-4 border-yellow-500 pl-4 py-2">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">July 25, 2025</span>
        </div>
        <h4 className="font-semibold text-gray-800 dark:text-white">Monthly Fire Alarm Test</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">All buildings - Comprehensive system test</p>
      </div>
      <div className="border-l-4 border-blue-500 pl-4 py-2">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">August 1, 2025</span>
        </div>
        <h4 className="font-semibold text-gray-800 dark:text-white">Fire Extinguisher Service</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">Annual inspection and refill</p>
      </div>
    </div>
  </div>
);

const ReportsSection = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Recent Reports</h2>
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-gray-400" />
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">Monthly Safety Report</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">July 2025</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">2 days ago</span>
      </div>
      <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-gray-400" />
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">Fire Drill Report</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Building A & B</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">1 week ago</span>
      </div>
    </div>
  </div>
);

export default FirefightingTracker;