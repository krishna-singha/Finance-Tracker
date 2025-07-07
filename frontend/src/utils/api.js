// API configuration
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const apiEndpoints = {
  // Auth endpoints
  login: `${API_BASE_URL}/api/v1/users/auth/login`,
  signup: `${API_BASE_URL}/api/v1/users/auth/signup`,
  profile: `${API_BASE_URL}/api/v1/users/profile`,
  
  // Transaction endpoints
  transactions: `${API_BASE_URL}/api/v1/transactions`,
  transactionById: (id) => `${API_BASE_URL}/api/v1/transactions/${id}`,
  
  // Category endpoints
  categories: `${API_BASE_URL}/api/v1/categories`,
  categoryById: (id) => `${API_BASE_URL}/api/v1/categories/${id}`,
  
  // Budget endpoints
  budgets: `${API_BASE_URL}/api/v1/budgets`,
  budgetById: (id) => `${API_BASE_URL}/api/v1/budgets/${id}`,
  
  // Goal endpoints
  goals: `${API_BASE_URL}/api/v1/goals`,
  goalById: (id) => `${API_BASE_URL}/api/v1/goals/${id}`,
  
  // AI endpoints
  ai: `${API_BASE_URL}/api/v1/ai`,
};

// Helper function to make authenticated API calls
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token might be expired, redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/signin';
      throw new Error('Authentication failed - redirecting to login');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response;
};
