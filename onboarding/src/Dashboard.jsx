import { useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { TrendingUp, Users, Target, Bell, Activity, Zap, Eye, Globe, Brain, Rocket } from 'lucide-react';

const Dashboard = () => {
  const { state } = useLocation();
  const { name, email, companyName, industry, size, theme, layout } = state || {};

  const [currentTheme, setCurrentTheme] = useState(theme || 'dark');
  const [activeCard, setActiveCard] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const scaleTransform = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const springValue = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    setCurrentTheme(theme || 'dark');
    setTimeout(() => setIsLoaded(true), 100);
  }, [theme]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const chartData = [
    { name: 'Mon', tasksCompleted: 15, progress: 30, revenue: 12500, efficiency: 85 },
    { name: 'Tue', tasksCompleted: 22, progress: 45, revenue: 18200, efficiency: 92 },
    { name: 'Wed', tasksCompleted: 28, progress: 60, revenue: 22100, efficiency: 88 },
    { name: 'Thu', tasksCompleted: 20, progress: 50, revenue: 16800, efficiency: 75 },
    { name: 'Fri', tasksCompleted: 35, progress: 70, revenue: 28500, efficiency: 96 },
    { name: 'Sat', tasksCompleted: 40, progress: 85, revenue: 32000, efficiency: 98 },
    { name: 'Sun', tasksCompleted: 42, progress: 90, revenue: 35200, efficiency: 94 },
  ];

  const pieData = [
    { name: 'Completed', value: 65, color: '#00d4aa' },
    { name: 'In Progress', value: 25, color: '#3b82f6' },
    { name: 'Pending', value: 10, color: '#f59e0b' },
  ];

  const metrics = [
    { id: 'teamMembers', title: 'Team Members', value: '42', change: '+12%', icon: Users, color: 'from-blue-500 to-cyan-400', bgColor: 'bg-gradient-to-br from-blue-500/10 to-cyan-400/10' },
    { id: 'activeProjects', title: 'Active Projects', value: '8', change: '+3', icon: Target, color: 'from-emerald-500 to-teal-400', bgColor: 'bg-gradient-to-br from-emerald-500/10 to-teal-400/10' },
    { id: 'notifications', title: 'Notifications', value: '15', change: '+5', icon: Bell, color: 'from-orange-500 to-red-400', bgColor: 'bg-gradient-to-br from-orange-500/10 to-red-400/10' },
    { id: 'efficiency', title: 'Efficiency', value: '94%', change: '+8%', icon: Zap, color: 'from-purple-500 to-pink-400', bgColor: 'bg-gradient-to-br from-purple-500/10 to-pink-400/10' },
  ];

  const isDarkMode = currentTheme === 'dark';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    },
  };

  const cardVariants = {
    initial: { 
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      boxShadow: isDarkMode 
        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" 
        : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    hover: {
      scale: 1.03,
      rotateX: 5,
      rotateY: 5,
      boxShadow: isDarkMode 
        ? "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)" 
        : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: { 
      scale: 0.98,
      rotateX: 0,
      rotateY: 0,
    },
    active: {
      scale: 1.05,
      boxShadow: isDarkMode 
        ? "0 25px 50px -12px rgba(59, 130, 246, 0.4), 0 0 0 2px rgba(59, 130, 246, 0.5)" 
        : "0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 0 2px rgba(59, 130, 246, 0.3)",
      transition: { duration: 0.2 }
    }
  };

  const floatingElements = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 40 + 20,
    delay: Math.random() * 2,
  }));

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen relative overflow-hidden transition-all duration-700 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
      }`}
      style={{
        backgroundImage: isDarkMode 
          ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`
          : `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08) 0%, transparent 50%)`
      }}
    >
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className={`absolute rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-black/5'} backdrop-blur-sm`}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: element.size,
              height: element.size,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + element.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Neural Network Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} 
             style={{
               backgroundImage: `radial-gradient(circle, ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'} 1px, transparent 1px)`,
               backgroundSize: '50px 50px',
               animation: 'pulse 4s ease-in-out infinite alternate'
             }} />
      </div>

      <motion.div
        className="relative z-10 p-6 sm:p-8 lg:p-12 font-sans"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={containerVariants}
        style={{ y: yTransform, scale: scaleTransform }}
      >
        {/* Header */}
        <motion.header
          className="mb-12 text-center relative"
          variants={itemVariants}
        >
          <motion.div
            className="inline-block mb-6"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h1 className={`text-6xl sm:text-7xl font-black bg-gradient-to-r ${isDarkMode ? 'from-blue-400 via-purple-400 to-cyan-400' : 'from-blue-600 via-purple-600 to-cyan-600'} bg-clip-text text-transparent mb-4`}>
              Dashboard
            </h1>
            <div className={`h-1 w-32 mx-auto bg-gradient-to-r ${isDarkMode ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} rounded-full`} />
          </motion.div>
          <motion.p 
            className={`text-xl sm:text-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Welcome to Dashboard,View account insights and real-time analytics
          </motion.p>
        </motion.header>

        {/* User Info Card */}
        <motion.section
          className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-xl rounded-3xl p-8 mb-12 border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} relative overflow-hidden`}
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
          animate={activeCard === 'userInfo' ? 'active' : 'initial'}
          onClick={() => setActiveCard(activeCard === 'userInfo' ? null : 'userInfo')}
          style={{ perspective: 1000 }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-blue-500/10 to-purple-500/10' : 'from-blue-500/5 to-purple-500/5'} pointer-events-none`} />
          
          <motion.div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${isDarkMode ? 'from-blue-500 to-purple-600' : 'from-blue-600 to-purple-700'}`}>
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Account Overview
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Name', value: name || 'Neural Agent' },
                { label: 'Email', value: email || 'neural@nexus.ai' },
                { label: 'Company', value: companyName || 'Nexus Corporation' },
                { label: 'Industry', value: industry || 'Advanced Technologies' },
                { label: 'Size', value: size || 'Enterprise Level' },
                { label: 'Theme', value: currentTheme || 'Neural Dark' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/50'} border ${isDarkMode ? 'border-gray-600/30' : 'border-gray-300/30'}`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium mb-1`}>{item.label}</p>
                  <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold text-lg`}>{item.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Metrics Grid */}
        <motion.section className="mb-12" variants={itemVariants}>
          <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.id}
                  className={`${isDarkMode ? 'bg-gray-800/60' : 'bg-white/80'} backdrop-blur-xl rounded-2xl p-6 border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} relative overflow-hidden cursor-pointer`}
                  variants={cardVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  animate={activeCard === metric.id ? 'active' : 'initial'}
                  onClick={() => setActiveCard(activeCard === metric.id ? null : metric.id)}
                  style={{ perspective: 1000 }}
                >
                  <div className={`absolute inset-0 ${metric.bgColor} pointer-events-none`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${metric.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {metric.change}
                      </span>
                    </div>
                    
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {metric.title}
                    </h3>
                    <p className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {metric.value}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main Performance Chart */}
          <motion.div
            className={`${isDarkMode ? 'bg-gray-800/60' : 'bg-white/80'} backdrop-blur-xl rounded-3xl p-8 border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} relative overflow-hidden`}
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
            animate={activeCard === 'chart' ? 'active' : 'initial'}
            onClick={() => setActiveCard(activeCard === 'chart' ? null : 'chart')}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-blue-500/5 to-purple-500/5' : 'from-blue-500/3 to-purple-500/3'} pointer-events-none`} />
            
            <div className="relative z-10">
              <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Performance Analytics
              </h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="tasksGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="name" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                      borderRadius: '12px',
                      color: isDarkMode ? '#f9fafb' : '#1f2937',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                  />
                  <Area type="monotone" dataKey="progress" stroke="#3b82f6" fillOpacity={1} fill="url(#progressGradient)" strokeWidth={3} />
                  <Area type="monotone" dataKey="tasksCompleted" stroke="#10b981" fillOpacity={1} fill="url(#tasksGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            className={`${isDarkMode ? 'bg-gray-800/60' : 'bg-white/80'} backdrop-blur-xl rounded-3xl p-8 border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} relative overflow-hidden`}
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
            animate={activeCard === 'pie' ? 'active' : 'initial'}
            onClick={() => setActiveCard(activeCard === 'pie' ? null : 'pie')}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-emerald-500/5 to-cyan-500/5' : 'from-emerald-500/3 to-cyan-500/3'} pointer-events-none`} />
            
            <div className="relative z-10">
              <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Task Distribution
              </h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                      borderRadius: '12px',
                      color: isDarkMode ? '#f9fafb' : '#1f2937'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="flex justify-center gap-4 mt-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Real-time Activity Feed */}
        <motion.section
          className={`${isDarkMode ? 'bg-gray-800/60' : 'bg-white/80'} backdrop-blur-xl rounded-3xl p-8 border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} relative overflow-hidden`}
          variants={itemVariants}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-purple-500/5 to-pink-500/5' : 'from-purple-500/3 to-pink-500/3'} pointer-events-none`} />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${isDarkMode ? 'from-purple-500 to-pink-600' : 'from-purple-600 to-pink-700'}`}>
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Insights
              </h2>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Live</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { time: '2 min ago', action: 'New project initialized', user: 'AI Agent Alpha', type: 'success' },
                { time: '5 min ago', action: 'Data sync completed', user: 'Neural Network', type: 'info' },
                { time: '12 min ago', action: 'Performance threshold exceeded', user: 'System Monitor', type: 'warning' },
                { time: '18 min ago', action: 'Team collaboration started', user: 'Collective Intelligence', type: 'success' },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100/50'} border ${isDarkMode ? 'border-gray-600/30' : 'border-gray-300/30'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'success' ? 'bg-green-400' :
                    activity.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`} />
                  <div className="flex-1">
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activity.action}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{activity.user} • {activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </motion.div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;