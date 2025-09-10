import  { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Heart,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Pie
} from 'recharts';

// Define color type for type safety
type ColorType = 'blue' | 'green' | 'orange' | 'purple' | 'pink';

const UmukzameziDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [animatedValues, setAnimatedValues] = useState({
    products: 0,
    users: 0,
    carts: 0,
    revenue: 0,
    wishlist: 0
  });

  // Sample data for charts
  const salesData = [
    { date: 'Mon', sales: 4200, orders: 28, users: 15 },
    { date: 'Tue', sales: 5100, orders: 34, users: 22 },
    { date: 'Wed', sales: 3800, orders: 25, users: 18 },
    { date: 'Thu', sales: 6200, orders: 41, users: 28 },
    { date: 'Fri', sales: 7800, orders: 52, users: 35 },
    { date: 'Sat', sales: 9200, orders: 61, users: 42 },
    { date: 'Sun', sales: 8500, orders: 56, users: 38 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3B82F6' },
    { name: 'Clothing', value: 25, color: '#10B981' },
    { name: 'Home & Garden', value: 20, color: '#F59E0B' },
    { name: 'Sports', value: 12, color: '#EF4444' },
    { name: 'Books', value: 8, color: '#8B5CF6' }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 65000, users: 120, products: 45 },
    { month: 'Feb', revenue: 75000, users: 135, products: 52 },
    { month: 'Mar', revenue: 85000, users: 148, products: 58 },
    { month: 'Apr', revenue: 92000, users: 162, products: 63 },
    { month: 'May', revenue: 88000, users: 156, products: 61 },
    { month: 'Jun', revenue: 102000, users: 175, products: 67 }
  ];

  // Animated counter effect
  useEffect(() => {
    const targets = {
      products: 156,
      users: 1247,
      carts: 89,
      revenue: 12450,
      wishlist: 324
    };

    const duration = 1500; // Reduced for better performance
    const steps = 30; // Reduced steps for smoother animation
    const stepDuration = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedValues({
        products: Math.floor(targets.products * progress),
        users: Math.floor(targets.users * progress),
        carts: Math.floor(targets.carts * progress),
        revenue: Math.floor(targets.revenue * progress),
        wishlist: Math.floor(targets.wishlist * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedValues(targets);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { 
      label: 'Total Products', 
      value: animatedValues.products.toLocaleString(), 
      icon: Package,
      change: '+12%',
      changeType: 'increase',
      color: 'blue' as ColorType
    },
    { 
      label: 'Total Users', 
      value: animatedValues.users.toLocaleString(), 
      icon: Users,
      change: '+8%',
      changeType: 'increase',
      color: 'green' as ColorType
    },
    { 
      label: 'Active Carts', 
      value: animatedValues.carts.toLocaleString(), 
      icon: ShoppingCart,
      change: '-3%',
      changeType: 'decrease',
      color: 'orange' as ColorType
    },
    { 
      label: 'Revenue', 
      value: `$${animatedValues.revenue.toLocaleString()}`, 
      icon: DollarSign,
      change: '+15%',
      changeType: 'increase',
      color: 'purple' as ColorType
    },
    { 
      label: 'Wishlist Items', 
      value: animatedValues.wishlist.toLocaleString(), 
      icon: Heart,
      change: '+22%',
      changeType: 'increase',
      color: 'pink' as ColorType
    }
  ];

  const downloadReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      stats: stats.map(s => ({ label: s.label, value: s.value, change: s.change })),
      salesData,
      categoryData,
      monthlyData
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `umukzamezi-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getColorClasses = (color: ColorType) => {
    const colorMap = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      pink: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' }
    };
    return colorMap[color];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Umukzamezi Dashboard</h1>
              <p className="text-gray-600 mt-1">E-commerce Analytics & Overview</p>
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
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                aria-label="Export report"
              >
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);
            
            return (
              <div 
                key={index} 
                className={`bg-white rounded-xl border ${colors.border} p-4 md:p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.changeType === 'increase' ? (
                        <ArrowUpRight size={14} className="text-green-600" />
                      ) : (
                        <ArrowDownRight size={14} className="text-red-600" />
                      )}
                      <span className={`text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 ${colors.bg} rounded-xl`}>
                    <Icon className={colors.text} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                Last 7 days
              </div>
            </div>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#salesGradient)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="text-green-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Product Categories</h3>
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
                    label
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
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-purple-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
          </div>
          <div className="h-64 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Bar dataKey="revenue" fill="#8B5CF6" name="Revenue ($)" animationDuration={1500} />
                <Bar dataKey="users" fill="#10B981" name="New Users" animationDuration={1500} />
                <Bar dataKey="products" fill="#F59E0B" name="Products Added" animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="text-orange-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {[
                { icon: Package, text: 'New product "Wireless Earbuds Pro" added', time: '2 minutes ago', color: 'green' as ColorType },
                { icon: ShoppingCart, text: 'Order #UM-1234 completed', time: '5 minutes ago', color: 'blue' as ColorType },
                { icon: Users, text: 'New user registration: alice@example.com', time: '8 minutes ago', color: 'purple' as ColorType },
                { icon: Heart, text: '15 items added to wishlists today', time: '12 minutes ago', color: 'pink' as ColorType },
                { icon: DollarSign, text: 'Revenue milestone: $100k reached', time: '1 hour ago', color: 'green' as ColorType }
              ].map((activity, index) => {
                const Icon = activity.icon;
                const colors = getColorClasses(activity.color);
                
                return (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`p-2 ${colors.bg} rounded-lg flex-shrink-0`}>
                      <Icon className={colors.text} size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Avg. Order Value</span>
                <span className="text-lg font-bold text-blue-600">$156.80</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
                <span className="text-lg font-bold text-green-600">3.2%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Cart Abandonment</span>
                <span className="text-lg font-bold text-orange-600">68.5%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Return Rate</span>
                <span className="text-lg font-bold text-purple-600">2.1%</span>
              </div>
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

export default UmukzameziDashboard;