import apiClient from './client';

export const authAPI = {
  /**
   * Register a new user
   */
  async register(email, password, firstName, lastName, company) {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
      company,
    });
    return response.data;
  },

  /**
   * Login user
   */
  async login(email, password) {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Get user profile
   */
  async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(firstName, lastName, company) {
    const response = await apiClient.put('/auth/profile', {
      firstName,
      lastName,
      company,
    });
    return response.data;
  },
};
