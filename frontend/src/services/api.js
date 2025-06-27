const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  getContests: async () => {
    const response = await fetch(`${API_BASE_URL}/contests`);
    

    if (!response.ok) {
        console.error("Failed to fetch contests:", response.status, response.statusText);
        throw new Error("Failed to fetch contests");
    }

    const data = await response.json();
    
    return data;
},


  getBookmarks: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/bookmarks/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch bookmarks');
    return response.json();
  },

  addBookmark: async (userId, contestId) => {
    const response = await fetch(`${API_BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, contestId }),
    });
    if (!response.ok) throw new Error('Failed to add bookmark');
    return response.json();
  },

  removeBookmark: async (userId, contestId) => {
    const response = await fetch(`${API_BASE_URL}/bookmarks/${userId}/${contestId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove bookmark');
    return response.status === 204;
  },

  // Solution APIs
  addSolution: async (contestId, solutionUrl) => {
    const response = await fetch(`${API_BASE_URL}/solutions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contestId, solutionUrl }),
    });
    if (!response.ok) throw new Error('Failed to add solution');
    return response.json();
  },
}