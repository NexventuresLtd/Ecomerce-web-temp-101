// app/authSlider/authSlider.ts
import mainAxios from "../../Instance/mainAxios";
import type { AuthSlider } from "../../types/authSlider";

export const authSliderService = {
  getAuthSliders: async (skip: number = 0, limit: number = 50): Promise<AuthSlider[]> => {
    const response = await mainAxios.get('/auth-sliders/', { params: { skip, limit } });
    return response.data;
  },

  getActiveAuthSliders: async (): Promise<AuthSlider[]> => {
    const response = await mainAxios.get('/auth-sliders/active', { skipAuthRedirect: true } as any);
    return response.data;
  },

  createAuthSlider: async (formData: FormData): Promise<AuthSlider> => {
    const response = await mainAxios.post('/auth-sliders/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateAuthSlider: async (sliderId: number, formData: FormData): Promise<AuthSlider> => {
    const response = await mainAxios.put(`/auth-sliders/${sliderId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteAuthSlider: async (sliderId: number): Promise<{ message: string }> => {
    const response = await mainAxios.delete(`/auth-sliders/${sliderId}`);
    return response.data;
  },
};
