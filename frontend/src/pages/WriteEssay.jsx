import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { essayAPI } from '../utils/api';
import { Send, Loader, BookOpen, Award, CheckCircle2, AlertCircle } from 'lucide-react';

const WriteEssay = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = content.length;
  const isValidLength = charCount >= 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidLength) {
      setError('Essay must be at least 100 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await essayAPI.evaluate({
        title: title || 'Untitled Essay',
        content,
      });
      
      navigate(`/essay/${response.data.essay_id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit essay. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800 rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Write Your Essay ✍️</h1>
        <p className="text-blue-100 dark:text-blue-200 text-lg">
          Get detailed AI-powered feedback on your writing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800">
            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-start space-x-3 animate-shake">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Error</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Essay Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3.5 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500 font-medium"
                  placeholder="Enter a compelling title for your essay"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                    Essay Content
                  </label>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`font-bold ${wordCount > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {wordCount} {wordCount === 1 ? 'word' : 'words'}
                    </span>
                    <span className="text-gray-400 dark:text-gray-600">|</span>
                    <span className={`font-bold ${isValidLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {charCount} chars
                    </span>
                  </div>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={18}
                  className="w-full px-4 py-4 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all outline-none placeholder-gray-400 dark:placeholder-gray-500 leading-relaxed"
                  placeholder="Start writing your essay here...

Tips for a great essay:
• Write at least 200-300 words for comprehensive evaluation
• Use proper paragraphs and clear structure
• Include introduction, body paragraphs, and conclusion
• Support your arguments with examples and evidence
• Proofread before submitting"
                  required
                />
              </div>

              {/* Character Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Minimum length: 100 characters
                  </span>
                  {isValidLength && (
                    <span className="flex items-center space-x-1 text-green-600 dark:text-green-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ready to submit</span>
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isValidLength 
                        ? 'bg-gradient-to-r from-green-500 to-green-600' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`}
                    style={{ width: `${Math.min((charCount / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-100 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
              <button
                type="submit"
                disabled={loading || !isValidLength}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 group"
              >
                {loading ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    <span>Analyzing your essay...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    <span>Submit for AI Evaluation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Evaluation Criteria */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Evaluation Criteria
              </h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Language Quality</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Grammar, vocabulary, and writing style</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Depth of Analysis</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Critical thinking and argumentation</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Clarity & Organization</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Structure, flow, and readability</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Writing Tips */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Pro Writing Tips
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span>Start with a clear thesis statement</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span>Use topic sentences for each paragraph</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span>Support claims with evidence and examples</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span>Vary your sentence structure</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span>End with a strong conclusion</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteEssay;
