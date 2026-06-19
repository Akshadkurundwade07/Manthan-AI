import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { essayAPI } from '../utils/api';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Award, Calendar, Trash2 } from 'lucide-react';

const EssayDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [essay, setEssay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchEssay();
  }, [id]);

  const fetchEssay = async () => {
    try {
      const response = await essayAPI.getOne(id);
      setEssay(response.data.essay);
    } catch (error) {
      console.error('Error fetching essay:', error);
      navigate('/history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await essayAPI.delete(id);
      navigate('/history');
    } catch (error) {
      console.error('Error deleting essay:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!essay) return null;

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/history')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to History</span>
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Essay?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. Are you sure you want to delete this essay?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Essay Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{essay.title}</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
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
            </div>
          </div>
          <div className={`text-center px-6 py-3 rounded-xl border-2 ${getScoreColor(essay.overall_score)}`}>
            <div className="text-3xl font-bold">{essay.overall_score}</div>
            <div className="text-sm font-medium">/ 10</div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Award className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Language Quality</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{essay.language_score}/10</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Award className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Analysis Depth</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{essay.analysis_score}/10</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Award className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Clarity</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">{essay.clarity_score}/10</div>
        </div>
      </div>

      {/* Essay Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Essay</h2>
        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap border-l-4 border-primary-200 pl-6 py-2">
          {essay.content}
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Feedback</h2>
        <div className="prose prose-slate max-w-none text-gray-800 prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700">
          <ReactMarkdown>{essay.overall_feedback}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default EssayDetail;
