const MestreOrcApi = (() => {
  const API_URL = localStorage.getItem('mestreOrcApiUrl') || 'http://localhost:3333/api';

  function getToken() {
    return localStorage.getItem('mestreOrcToken') || localStorage.getItem('mestreOrcAuthToken') || '';
  }

  async function request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || 'Não foi possível conectar com a API Mestre Orc.');
    }

    return data;
  }

  return {
    API_URL,
    get: (path) => request(path),
    post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) })
  };
})();
