import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { essayAPI } from '../utils/api';
import { FileText, Calendar, ArrowRight } from 'lucide-react';

const History = () => {
  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEssays();
  }, []);

  const fetchEssays = async () => {
    try {
      const response = await essayAPI.getAll();
      setEssays(response.data.essays);
    } catch (error) {
      console.error('Error fetching essays:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEssays = essays.filter((essay) => {
    if (filter === 'all') return true;
    if (filter === 'excellent') return essay.overall_score >= 8;
    if (filter === 'good') return essay.overall_score >= 6 && essay.overall_score < 8;
    if (filter === 'needs-improvement') return essay.overall_score < 6;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Essay History</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">View and review all your submitted essays</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Essays ({essays.length})
          </button>
          <button
            onClick={() => setFilter('excellent')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'excellent'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Excellent (8-10)
          </button>
          <button
            onClick={() => setFilter('good')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'good'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Good (6-7)
          </button>
          <button
            onClick={() => setFilter('needs-improvement')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'needs-improvement'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Needs Improvement (&lt;6)
          </button>
        </div>
      </div>

      {/* Essays List */}
      {filteredEssays.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredEssays.map((essay) => (
            <Link
              key={essay.id}
              to={`/essay/${essay.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-primary-200 transition group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition">
                      {essay.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(essay.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <span>•</span>
                    <span>{essay.content.split(/\s+/).length} words</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div
                      className={`text-3xl font-bold ${
                        essay.overall_score >= 8
                          ? 'text-green-600'
                          : essay.overall_score >= 6
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {essay.overall_score}
                    </div>
                    <div className="text-sm text-gray-500">/ 10</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No essays yet' : 'No essays in this category'}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all'
              ? 'Start writing your first essay to see it here'
              : 'Try a different filter to view your essays'}
          </p>
          {filter === 'all' && (
            <Link
              to="/write"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <FileText className="w-4 h-4" />
              <span>Write Your First Essay</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
