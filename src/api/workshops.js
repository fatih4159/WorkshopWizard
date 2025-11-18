import apiClient from './client';

export const workshopAPI = {
  /**
   * Create a new workshop
   */
  async create(title, data = null) {
    const response = await apiClient.post('/workshops', {
      title,
      data,
    });
    return response.data;
  },

  /**
   * Get all workshops for the current user
   */
  async getAll() {
    const response = await apiClient.get('/workshops');
    return response.data;
  },

  /**
   * Get a specific workshop by ID
   */
  async getById(id) {
    const response = await apiClient.get(`/workshops/${id}`);
    return response.data;
  },

  /**
   * Update a workshop
   */
  async update(id, updates) {
    const response = await apiClient.put(`/workshops/${id}`, updates);
    return response.data;
  },

  /**
   * Delete a workshop
   */
  async delete(id) {
    const response = await apiClient.delete(`/workshops/${id}`);
    return response.data;
  },
};
