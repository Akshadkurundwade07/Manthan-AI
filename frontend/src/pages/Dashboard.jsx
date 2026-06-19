import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profileAPI, essayAPI } from '../utils/api';
import { Edit, TrendingUp, FileText, Award, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_essays: 0,
    average_score: 0,
  });
  const [recentEssays, setRecentEssays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, essaysRes] = await Promise.all([
        profileAPI.getProfile(),
        essayAPI.getAll(),
      ]);

      setStats(profileRes.data.stats);
      setUser(profileRes.data.user);
      setRecentEssays(essaysRes.data.essays.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = recentEssays
    .slice()
    .reverse()
    .map((essay, index) => ({
      name: `Essay ${index + 1}`,
      score: essay.overall_score,
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
          <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.full_name || user?.username}! 👋</h1>
            <p className="text-blue-100 dark:text-blue-200 text-lg">
              Track your essay writing progress and continue improving
            </p>
          </div>
          <Link
            to="/write"
            className="hidden md:flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
          >
            <Edit className="w-5 h-5" />
            <span>Write New Essay</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-2 border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Essays</p>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-3">
                {stats.total_essays}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Essays submitted</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-2 border-gray-100 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-800 group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Average Score</p>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-3">
                {stats.average_score.toFixed(1)}<span className="text-2xl text-gray-500 dark:text-gray-400">/10</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Overall performance</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Award className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-2 border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Your Progress</p>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-3">
                {stats.total_essays > 0 ? '🚀' : '✨'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {stats.total_essays > 0 ? 'Keep going!' : 'Start your journey'}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border-2 border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Score Progression</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track your improvement over time</p>
            </div>
            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-semibold">
              Last {chartData.length} essays
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                style={{ fontSize: '14px', fontWeight: '500' }}
              />
              <YAxis 
                domain={[0, 10]} 
                stroke="#6B7280"
                style={{ fontSize: '14px', fontWeight: '500' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFF', 
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '12px',
                  fontWeight: '600'
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ fill: '#2563EB', r: 6, strokeWidth: 2, stroke: '#FFF' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Essays */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800">
        <div className="p-6 border-b-2 border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Essays</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Your latest submissions</p>
            </div>
            <Link
              to="/history"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {recentEssays.length > 0 ? (
          <div className="divide-y-2 divide-gray-100 dark:divide-gray-800">
            {recentEssays.map((essay) => (
              <Link
                key={essay.id}
                to={`/essay/${essay.id}`}
                className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 truncate">
                      {essay.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          {new Date(essay.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <span>•</span>
                      <span className="font-medium">{essay.content.split(/\s+/).length} words</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`px-6 py-3 rounded-xl border-2 ${
                      essay.overall_score >= 8
                        ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
                        : essay.overall_score >= 6
                        ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
                        : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
                    }`}>
                      <div className={`text-3xl font-extrabold ${
                        essay.overall_score >= 8
                          ? 'text-green-600 dark:text-green-400'
                          : essay.overall_score >= 6
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {essay.overall_score}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-bold text-center">/ 10</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Edit className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No essays yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start your essay writing journey with AI-powered feedback and personalized insights
            </p>
            <Link
              to="/write"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-bold text-lg"
            >
              <Edit className="w-5 h-5" />
              <span>Write Your First Essay</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
