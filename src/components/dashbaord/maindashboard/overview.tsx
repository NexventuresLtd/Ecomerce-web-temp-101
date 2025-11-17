import { useState, useEffect } from 'react';
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Heart,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Shield,
  Layers,
  BarChart4,
  // FileText,
  Smartphone
} from 'lucide-react';
import {

  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie
} from 'recharts';

import mainAxios from '../../../Instance/mainAxios';
import { useAppContext } from '../../../contexts/dashbaord/context';

// Define types based on your backend response
interface DashboardSummary {
  users: {
    total: number;
    active: number;
    verified: number;
  };
  products: {
    total: number;
    active: number;
    featured: number;
  };
  categories: {
    main: number;
    sub: number;
    product: number;
  };
  carts: {
    total: number;
    active: number;
    inactive: number;
  };
  wishlists: {
    total: number;
    active: number;
    inactive: number;
  };
  billings: number;
  logs: {
    total_logins: number;
    active_devices: number;
  };
}

interface StatCard {
  label: string;
  value: number;
  icon: any;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  color: 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'indigo' | 'teal';
  description?: string;
}

type ColorType = 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'indigo' | 'teal';

const umukameziDashboard = () => {
  const { setCurrentView } = useAppContext();
  
  const [timeRange, setTimeRange] = useState('7d');
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animatedValues, setAnimatedValues] = useState({
    totalUsers: 0,
    totalProducts: 0,
    activeCarts: 0,
    totalBillings: 0,
    activeWishlists: 0,
    verifiedUsers: 0,
    featuredProducts: 0,
    mainCategories: 0
  });

  // Fetch data from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mainAxios.get('/dashboard/summary');
      setDashboardData(response.data);

      // Start animation with actual data
      animateValues(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Animate values from 0 to actual values
  const animateValues = (data: DashboardSummary) => {
    const targets = {
      totalUsers: data.users.total,
      totalProducts: data.products.total,
      activeCarts: data.carts.active,
      totalBillings: data.billings,
      activeWishlists: data.wishlists.active,
      verifiedUsers: data.users.verified,
      featuredProducts: data.products.featured,
      mainCategories: data.categories.main
    };

    const duration = 1200;
    const steps = 40;
    const stepDuration = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setAnimatedValues({
        totalUsers: Math.floor(targets.totalUsers * progress),
        totalProducts: Math.floor(targets.totalProducts * progress),
        activeCarts: Math.floor(targets.activeCarts * progress),
        totalBillings: Math.floor(targets.totalBillings * progress),
        activeWishlists: Math.floor(targets.activeWishlists * progress),
        verifiedUsers: Math.floor(targets.verifiedUsers * progress),
        featuredProducts: Math.floor(targets.featuredProducts * progress),
        mainCategories: Math.floor(targets.mainCategories * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedValues(targets);
      }
    }, stepDuration);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate percentages and changes (you can replace with actual historical data)
  const calculateChange = (current: number, previous: number = 0) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  const getChangeType = (change: string): 'increase' | 'decrease' | 'neutral' => {
    if (change.startsWith('+')) return 'increase';
    if (change.startsWith('-')) return 'decrease';
    return 'neutral';
  };

  // Generate stats cards from dashboard data
  const stats: StatCard[] = dashboardData ? [
    {
      label: 'Total Users',
      value: animatedValues.totalUsers,
      icon: Users,
      change: calculateChange(dashboardData.users.total, dashboardData.users.total * 0.92), // Example previous value
      changeType: getChangeType(calculateChange(dashboardData.users.total, dashboardData.users.total * 0.92)),
      color: 'blue',
      description: `${dashboardData.users.active} active, ${dashboardData.users.verified} verified`
    },
    {
      label: 'Total Products',
      value: animatedValues.totalProducts,
      icon: Package,
      change: calculateChange(dashboardData.products.total, dashboardData.products.total * 0.88),
      changeType: getChangeType(calculateChange(dashboardData.products.total, dashboardData.products.total * 0.88)),
      color: 'green',
      description: `${dashboardData.products.active} active, ${dashboardData.products.featured} featured`
    },
    {
      label: 'Active Carts',
      value: animatedValues.activeCarts,
      icon: ShoppingCart,
      change: calculateChange(dashboardData.carts.active, dashboardData.carts.active * 0.95),
      changeType: getChangeType(calculateChange(dashboardData.carts.active, dashboardData.carts.active * 0.95)),
      color: 'orange',
      description: `${dashboardData.carts.total} total carts`
    },
    {
      label: 'Total Orders',
      value: animatedValues.totalBillings,
      icon: DollarSign,
      change: calculateChange(dashboardData.billings, dashboardData.billings * 0.85),
      changeType: getChangeType(calculateChange(dashboardData.billings, dashboardData.billings * 0.85)),
      color: 'purple',
      description: 'Completed transactions'
    },
    {
      label: 'Active Wishlists',
      value: animatedValues.activeWishlists,
      icon: Heart,
      change: calculateChange(dashboardData.wishlists.active, dashboardData.wishlists.active * 0.78),
      changeType: getChangeType(calculateChange(dashboardData.wishlists.active, dashboardData.wishlists.active * 0.78)),
      color: 'pink',
      description: `${dashboardData.wishlists.total} total wishlists`
    },
    {
      label: 'Verified Users',
      value: animatedValues.verifiedUsers,
      icon: Shield,
      change: calculateChange(dashboardData.users.verified, dashboardData.users.verified * 0.90),
      changeType: getChangeType(calculateChange(dashboardData.users.verified, dashboardData.users.verified * 0.90)),
      color: 'indigo',
      description: `${Math.round((dashboardData.users.verified / dashboardData.users.total) * 100)}% verification rate`
    },
    {
      label: 'Categories',
      value: animatedValues.mainCategories,
      icon: Layers,
      change: calculateChange(dashboardData.categories.main, dashboardData.categories.main * 0.95),
      changeType: getChangeType(calculateChange(dashboardData.categories.main, dashboardData.categories.main * 0.95)),
      color: 'teal',
      description: `${dashboardData.categories.sub} sub-categories, ${dashboardData.categories.product} product categories`
    },
    {
      label: 'Featured Products',
      value: animatedValues.featuredProducts,
      icon: Star,
      change: calculateChange(dashboardData.products.featured, dashboardData.products.featured * 0.80),
      changeType: getChangeType(calculateChange(dashboardData.products.featured, dashboardData.products.featured * 0.80)),
      color: 'orange',
      description: `${Math.round((dashboardData.products.featured / dashboardData.products.total) * 100)}% of total products`
    }
  ] : [];


  const categoryData = dashboardData ? [
    { name: 'Main Categories', value: dashboardData.categories.main, color: '#3B82F6' },
    { name: 'Sub Categories', value: dashboardData.categories.sub, color: '#10B981' },
    { name: 'Product Categories', value: dashboardData.categories.product, color: '#F59E0B' }
  ] : [];

  const systemData = dashboardData ? [
    { name: 'Active Users', value: dashboardData.users.active, color: '#10B981' },
    { name: 'Inactive Users', value: dashboardData.users.total - dashboardData.users.active, color: '#EF4444' },
    { name: 'Active Carts', value: dashboardData.carts.active, color: '#3B82F6' },
    { name: 'Active Wishlists', value: dashboardData.wishlists.active, color: '#EC4899' }
  ] : [];

  const downloadReport = () => {
    if (!dashboardData) return;

    const reportData = {
      timestamp: new Date().toISOString(),
      summary: dashboardData,
      stats: stats.map(s => ({
        label: s.label,
        value: s.value,
        change: s.change,
        description: s.description
      })),
      timeRange: timeRange
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `umukamezi-dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getColorClasses = (color: ColorType) => {
    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      pink: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' }
    };
    return colorMap[color];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
            <p className="text-red-800 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">umukamezi Dashboard</h1>
              <p className="text-gray-600 mt-1">Real-time E-commerce Analytics & Overview</p>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                aria-label="Select time range"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button
                onClick={downloadReport}
                className="flex items-center hidden justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                aria-label="Export report"
              >
                <Download size={16} />
                Export Report
              </button>
              <button
                onClick={fetchDashboardData}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
                aria-label="Refresh data"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);

            return (
              <div
                key={index}
                className={`bg-white rounded-xl border ${colors.border} p-4 md:p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 ${colors.bg} rounded-lg`}>
                    <Icon className={colors.text} size={20} />
                  </div>
                  {stat.change && (
                    <div className="flex items-center gap-1">
                      {stat.changeType === 'increase' ? (
                        <ArrowUpRight size={14} className="text-green-600" />
                      ) : stat.changeType === 'decrease' ? (
                        <ArrowDownRight size={14} className="text-red-600" />
                      ) : null}
                      <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' :
                          stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                        {stat.change}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                {stat.description && (
                  <p className="text-xs text-gray-500">{stat.description}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Overview Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart4 className="text-blue-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">System Overview</h3>
            </div>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={systemData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {systemData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="text-green-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
            </div>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={60}
                    dataKey="value"
                    animationDuration={1500}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Login Statistics */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="text-indigo-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Login Statistics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Logins</span>
                <span className="text-lg font-bold text-indigo-600">
                  {dashboardData?.logs.total_logins.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Active Devices</span>
                <span className="text-lg font-bold text-green-600">
                  {dashboardData?.logs.active_devices.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Cart & Wishlist Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="text-orange-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Shopping Activity</h3>
            </div>
            <div onClick={() => setCurrentView?.("carts")}  className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Carts</span>
                <span className="text-lg font-bold text-orange-600">
                  {dashboardData?.carts.total.toLocaleString()}
                </span>
              </div>
              <div onClick={() => setCurrentView?.("wishlists")} className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Wishlists</span>
                <span className="text-lg font-bold text-pink-600">
                  {dashboardData?.wishlists.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {/* <button className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <FileText className="text-blue-600" size={18} />
                <span className="text-sm font-medium text-gray-700">Generate Report</span>
              </button> */}
              <button onClick={() => setCurrentView?.("users")} className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Users className="text-green-600" size={18} />
                <span className="text-sm font-medium text-gray-700">View Users</span>
              </button>
              <button onClick={() => setCurrentView?.("products")} className="w-full flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Package className="text-purple-600" size={18} />
                <span className="text-sm font-medium text-gray-700">Manage Products</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

// Add missing RefreshCw and Star icons
const RefreshCw = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const Star = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default umukameziDashboard;