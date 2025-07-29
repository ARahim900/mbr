/**
 * Utility functions for color mapping throughout the application
 */

// Water meter type colors
export const getTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    'Main Bulk': 'from-blue-500 to-blue-600',
    'Zone Bulk': 'from-green-500 to-green-600', 
    'Building Bulk': 'from-purple-500 to-purple-600',
    'Unit Meter': 'from-orange-500 to-orange-600',
    'default': 'from-gray-500 to-gray-600'
  };
  
  return typeColors[type] || typeColors['default'];
};

// Water meter status colors  
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'Active': 'from-green-500 to-green-600',
    'Inactive': 'from-red-500 to-red-600',
    'Maintenance': 'from-yellow-500 to-yellow-600',
    'default': 'from-gray-500 to-gray-600'
  };
  
  return statusColors[status] || statusColors['default'];
};

// Chart color palette
export const chartColors = {
  primary: '#00D2B3',
  secondary: '#4E4456',
  accent: '#FF6B6B',
  success: '#4ECDC4',
  warning: '#FFE66D',
  info: '#74B9FF',
  light: '#DDD6FE',
  dark: '#374151'
};

// Gradient backgrounds for cards
export const cardGradients = {
  water: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
  electricity: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
  hvac: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
  fire: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
  contractor: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20',
  stp: 'from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20'
};

// Status badge colors
export const statusBadgeColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
};