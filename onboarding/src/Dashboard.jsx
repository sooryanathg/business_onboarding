import { useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const { state } = useLocation();
  const { name, email, companyName, industry, size, theme, layout } = state || {};

  // Sample data for the weekly progress chart
  const chartData = [
    { name: 'Mon', progress: 30 },
    { name: 'Tue', progress: 45 },
    { name: 'Wed', progress: 60 },
    { name: 'Thu', progress: 50 },
    { name: 'Fri', progress: 70 },
    { name: 'Sat', progress: 85 },
    { name: 'Sun', progress: 90 },
  ];

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* User Info */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <p><strong>Name:</strong> {name || 'N/A'}</p>
        <p><strong>Email:</strong> {email || 'N/A'}</p>
        <p><strong>Company:</strong> {companyName || 'N/A'}</p>
        <p><strong>Industry:</strong> {industry || 'N/A'}</p>
        <p><strong>Company Size:</strong> {size || 'N/A'}</p>
        <p><strong>Theme:</strong> {theme || 'N/A'}</p>
        <p><strong>Layout:</strong> {layout || 'N/A'}</p>
      </div>

      {/* Informative Cards */}
      <div className={`grid ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'} gap-6 mb-8`}>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Team Members</h3>
          <p className="text-3xl font-bold">42</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Active Projects</h3>
          <p className="text-3xl font-bold">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <p className="text-3xl font-bold">15</p>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
        <LineChart
          width={600}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="progress" stroke="#3b82f6" />
        </LineChart>
      </div>
    </div>
  );
};

export default Dashboard;