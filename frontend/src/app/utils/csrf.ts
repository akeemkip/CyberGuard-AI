/**
 * CSRF Protection Utility
 * Manages CSRF tokens for secure API requests
 */

let csrfToken: string | null = null;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Fetch CSRF token from the server
 * This should be called after user logs in
 */
export const fetchCsrfToken = async (): Promise<string | null> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Cannot fetch CSRF token: No auth token found');
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/csrf-token`, {
      method: 'GET',
      credentials: 'include', // Important: Include cookies
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      csrfToken = data.csrfToken;
      return csrfToken;
    } else {
      console.error('Failed to fetch CSRF token:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
};

/**
 * Get the current CSRF token
 * If no token exists, attempts to fetch one
 */
export const getCsrfToken = async (): Promise<string | null> => {
  if (!csrfToken) {
    await fetchCsrfToken();
  }
  return csrfToken;
};

/**
 * Clear the CSRF token (call on logout)
 */
export const clearCsrfToken = () => {
  csrfToken = null;
};

/**
 * Add CSRF token to request headers
 */
export const addCsrfHeader = async (headers: HeadersInit = {}): Promise<HeadersInit> => {
  const token = await getCsrfToken();

  if (token) {
    return {
      ...headers,
      'X-CSRF-Token': token
    };
  }

  return headers;
};
