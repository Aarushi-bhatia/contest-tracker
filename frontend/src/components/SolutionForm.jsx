import React, { useState } from 'react';
import { api } from '../services/api';

const SolutionForm = () => {
  const [formData, setFormData] = useState({
    contestId: '',
    solutionUrl: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus({ type: 'loading', message: 'Adding solution...' });
      await api.addSolution(formData.contestId, formData.solutionUrl);
      setStatus({ type: 'success', message: 'Solution added successfully!' });
      setFormData({ contestId: '', solutionUrl: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Add Contest Solution
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="contestId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Contest ID
            </label>
            <input
              type="text"
              id="contestId"
              value={formData.contestId}
              onChange={(e) => setFormData({ ...formData, contestId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label
              htmlFor="solutionUrl"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Solution URL
            </label>
            <input
              type="url"
              id="solutionUrl"
              value={formData.solutionUrl}
              onChange={(e) => setFormData({ ...formData, solutionUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          {status.message && (
            <div
              className={`p-4 rounded-md ${
                status.type === 'error'
                  ? 'bg-red-100 text-red-700'
                  : status.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={status.type === 'loading'}
            className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {status.type === 'loading' ? 'Adding...' : 'Add Solution'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SolutionForm;