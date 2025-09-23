import mainAxios from "../../Instance/mainAxios";
import type { Vlog, VlogCreate } from "../../types/vlog/vogtypes";

export const vlogService = {
  // Get all vlogs
  getVlogs: async (skip: number = 0, limit: number = 20): Promise<Vlog[]> => {
    const response = await mainAxios.get('/vlogs/', {
      params: { skip, limit }
    });
    return response.data;
  },

  // Get single vlog
  getVlog: async (vlogId: string): Promise<Vlog> => {
    const response = await mainAxios.get(`/vlogs/${vlogId}`);
    return response.data;
  },

  // Create vlog
  createVlog: async (vlogData: VlogCreate): Promise<Vlog> => {
    const response = await mainAxios.post('/vlogs/', vlogData);
    return response.data;
  },

  // Update vlog
  updateVlog: async (vlogId: string, vlogData: VlogCreate): Promise<Vlog> => {
    const response = await mainAxios.put(`/vlogs/update/${vlogId}`, vlogData);
    return response.data;
  },

  // Delete vlog
  deleteVlog: async (vlogId: string): Promise<{ message: string }> => {
    const response = await mainAxios.delete(`/vlogs/delete/${vlogId}`);
    return response.data;
  }
};