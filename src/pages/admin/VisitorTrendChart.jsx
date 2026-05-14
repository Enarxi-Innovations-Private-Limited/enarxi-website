import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const VisitorTrendChart = ({ data, period }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500 text-poppins">No visitor data available yet.</p>
      </div>
    );
  }

  // Format dates for display based on period
  const chartData = data.map((item, index) => {
    const date = new Date(item.date);
    let displayDate = '';

    if (period === 'weekly') {
      displayDate = `Week ${index + 1}`;
    } else if (period === 'monthly') {
      displayDate = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    } else {
      displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    return {
      ...item,
      displayDate
    };
  });

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="displayDate" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '8px', 
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            labelStyle={{ fontWeight: 'bold', color: '#111827' }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#3B82F6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorCount)" 
            name="Visitors"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisitorTrendChart;
