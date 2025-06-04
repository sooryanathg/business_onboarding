import { useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const { state } = useLocation();
  // Destructure with default empty object to avoid errors if state is null
  const { name, email, companyName, industry, size, theme, layout } = state || {};

  // State to manage the actual theme being applied, for dynamic toggling
  const [currentTheme, setCurrentTheme] = useState(theme || 'light');

  useEffect(() => {
    // Update theme if it changes from onboarding, or default to light
    setCurrentTheme(theme || 'light');
  }, [theme]);

  // Sample data for the weekly progress chart
  // Enhanced for more realistic data and varied values
  const chartData = [
    { name: 'Mon', tasksCompleted: 15, progress: 30 },
    { name: 'Tue', tasksCompleted: 22, progress: 45 },
    { name: 'Wed', tasksCompleted: 28, progress: 60 },
    { name: 'Thu', tasksCompleted: 20, progress: 50 },
    { name: 'Fri', tasksCompleted: 35, progress: 70 },
    { name: 'Sat', tasksCompleted: 40, progress: 85 },
    { name: 'Sun', tasksCompleted: 42, progress: 90 },
  ];

  // Determine text and background colors based on the theme
  const isDarkMode = currentTheme === 'dark';
  const bgColorClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50'; // Slightly darker dark mode background
  const textColorClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const cardShadowClass = isDarkMode ? 'shadow-xl' : 'shadow-md';
  const borderColor = isDarkMode ? '#4a5568' : '#e2e8f0'; // For chart grid lines

  return (
    <div className={`min-h-screen p-6 sm:p-8 lg:p-10 font-sans transition-colors duration-300 ${bgColorClass} ${textColorClass}`}>
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-600 mb-2">
          Welcome to Your Dashboard!
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          A quick overview of your key metrics and personalized settings.
        </p>
      </header>

      {/* User Info & Settings */}
      <section className={`${cardBgClass} ${cardShadowClass} rounded-xl p-6 sm:p-8 mb-8`}>
        <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">
          Account Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm sm:text-base">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Name</p>
            <p className="font-semibold">{name || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-semibold">{email || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Company</p>
            <p className="font-semibold">{companyName || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Industry</p>
            <p className="font-semibold">{industry || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Company Size</p>
            <p className="font-semibold">{size || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Preferred Theme</p>
            <p className="font-semibold capitalize">{currentTheme || 'Light (default)'}</p>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <p className="text-gray-500 dark:text-gray-400">Dashboard Layout</p>
            <p className="font-semibold capitalize">{layout || 'Grid (default)'}</p>
          </div>
        </div>
      </section>

      ---

      {/* Key Performance Indicators (KPIs) */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">
          Key Metrics
        </h2>
        <div className={`grid ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          <div className={`${cardBgClass} ${cardShadowClass} rounded-xl p-6 flex flex-col items-start`}>
            <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Team Members</h3>
            <p className="text-5xl font-extrabold text-blue-600">42</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Current active members</p>
          </div>
          <div className={`${cardBgClass} ${cardShadowClass} rounded-xl p-6 flex flex-col items-start`}>
            <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Active Projects</h3>
            <p className="text-5xl font-extrabold text-green-600">8</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Projects in progress</p>
          </div>
          <div className={`${cardBgClass} ${cardShadowClass} rounded-xl p-6 flex flex-col items-start`}>
            <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">New Notifications</h3>
            <p className="text-5xl font-extrabold text-red-600">15</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Unread alerts today</p>
          </div>
        </div>
      </section>

      ---

      {/* Data Visualization */}
      <section>
        <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">
          Weekly Performance
        </h2>
        <div className={`${cardBgClass} ${cardShadowClass} rounded-xl p-6`}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
              <XAxis dataKey="name" stroke={isDarkMode ? '#cbd5e0' : '#4a5568'} /> {/* Axis color for theme */}
              <YAxis stroke={isDarkMode ? '#cbd5e0' : '#4a5568'} /> {/* Axis color for theme */}
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
                  borderColor: isDarkMode ? '#4a5568' : '#e2e8f0',
                  borderRadius: '8px',
                  color: isDarkMode ? '#f9fafb' : '#1f2937'
                }}
                itemStyle={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}
                labelStyle={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', color: isDarkMode ? '#cbd5e0' : '#4a5568' }} />
              <Line
                type="monotone"
                dataKey="progress"
                name="Overall Progress (%)"
                stroke="#3b82f6" // Primary blue line
                strokeWidth={3}
                activeDot={{ r: 8, fill: '#3b82f6', stroke: 'white', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="tasksCompleted"
                name="Tasks Completed"
                stroke="#22c55e" // Success green line
                strokeWidth={3}
                activeDot={{ r: 8, fill: '#22c55e', stroke: 'white', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;