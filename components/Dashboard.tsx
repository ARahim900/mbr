import React from 'react';
import { BarChart3, TrendingUp, Users, Building2, Droplets, Zap, Thermometer, Wrench, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Buildings',
      value: '24',
      change: '+2',
      icon: <Building2 className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Meters',
      value: '156',
      change: '+12',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Water Consumption',
      value: '2.4M',
      unit: 'L',
      change: '-5%',
      icon: <Droplets className="w-6 h-6" />,
      color: 'bg-cyan-500'
    },
    {
      title: 'Energy Usage',
      value: '45.2',
      unit: 'kWh',
      change: '+3%',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-yellow-500'
    }
  ];

  const quickActions = [
    {
      title: 'Water System',
      description: 'Monitor water consumption and quality',
      icon: <Droplets className="w-8 h-8" />,
      color: 'bg-blue-500/20 text-blue-400',
      href: '#water'
    },
    {
      title: 'Electricity System',
      description: 'Track energy usage and efficiency',
      icon: <Zap className="w-8 h-8" />,
      color: 'bg-yellow-500/20 text-yellow-400',
      href: '#electricity'
    },
    {
      title: 'HVAC System',
      description: 'Climate control and ventilation',
      icon: <Thermometer className="w-8 h-8" />,
      color: 'bg-green-500/20 text-green-400',
      href: '#hvac'
    },
    {
      title: 'Contractor Tracker',
      description: 'Manage maintenance and services',
      icon: <Wrench className="w-8 h-8" />,
      color: 'bg-purple-500/20 text-purple-400',
      href: '#contractor'
    }
  ];

  return (
    <div className="space-y-6" data-aos="fade-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome to Muscat Bay Assets & Operations Management</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300" data-aos="fade-up" data-aos-delay={index * 100}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-white">
                {stat.value}
                {stat.unit && <span className="text-lg text-gray-400 ml-1">{stat.unit}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50" data-aos="fade-up" data-aos-delay="400">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-gray-700/50 rounded-lg p-6 hover:bg-gray-600/50 transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50">
                <div className={`p-3 rounded-lg ${action.color} w-fit mb-4`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {action.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50" data-aos="fade-up" data-aos-delay="500">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { time: '2 hours ago', message: 'Water consumption alert in Building A', type: 'warning' },
            { time: '4 hours ago', message: 'HVAC maintenance completed in Building C', type: 'success' },
            { time: '6 hours ago', message: 'New meter installed in Building B', type: 'info' },
            { time: '1 day ago', message: 'Energy efficiency report generated', type: 'info' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
              <div className={`p-2 rounded-full ${
                activity.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                activity.type === 'success' ? 'bg-green-500/20 text-green-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {activity.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                 activity.type === 'success' ? <TrendingUp className="w-4 h-4" /> :
                 <BarChart3 className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{activity.message}</p>
                <p className="text-gray-400 text-xs">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 