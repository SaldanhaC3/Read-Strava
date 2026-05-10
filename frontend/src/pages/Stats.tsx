import { useEffect, useState } from 'react';
import api from '../api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Stats = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/stats').then(res => setStats(res.data));
  }, []);

  if (!stats) return <div>Loading stats...</div>;

  // Prepare chart data
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return format(d, 'MMM dd');
  });

  const ppmData = last7Days.map(label => {
    // Find sessions for this day
    const daySessions = stats.sessions.filter((s: any) => format(new Date(s.created_at), 'MMM dd') === label);
    if (daySessions.length === 0) return 0;
    const avgPpm = daySessions.reduce((acc: number, s: any) => acc + Number(s.ppm), 0) / daySessions.length;
    return avgPpm;
  });

  const chartData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Average PPM',
        data: ppmData,
        borderColor: '#10b981',
        backgroundColor: '#10b981',
        tension: 0.3,
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Stats</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-medium mb-1">Books Read</h3>
          <div className="text-4xl font-bold">{stats.booksRead}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-medium mb-1">Total Sessions</h3>
          <div className="text-4xl font-bold">{stats.sessions.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-medium mb-1">Avg Speed (PPM)</h3>
          <div className="text-4xl font-bold">
            {stats.sessions.length > 0 ? (stats.sessions.reduce((acc: number, s: any) => acc + Number(s.ppm), 0) / stats.sessions.length).toFixed(1) : 0}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-lg font-bold mb-4">Reading Speed (Last 7 Days)</h3>
        <div className="h-64">
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default Stats;
