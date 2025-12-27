// app/sliders/sliders.ts
import mainAxios from "../../Instance/mainAxios";
import type { HeroSlider, HeroSliderCreate } from "../../types/sliders";

export const heroSliderService = {
  // Get all hero sliders
  getHeroSliders: async (skip: number = 0, limit: number = 20): Promise<HeroSlider[]> => {
    const response = await mainAxios.get('/hero-sliders/', {
      params: { skip, limit }
    });
    return response.data;
  },

  // Create hero slider with FormData (file upload)
  createHeroSlider: async (formData: FormData): Promise<HeroSlider> => {
    const response = await mainAxios.post('/hero-sliders/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update hero slider with FormData (file upload)
  updateHeroSlider: async (sliderId: string, formData: FormData): Promise<HeroSlider> => {
    const response = await mainAxios.put(`/hero-sliders/${sliderId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete hero slider
  deleteHeroSlider: async (sliderId: string): Promise<{ message: string }> => {
    const response = await mainAxios.delete(`/hero-sliders/${sliderId}`);
    return response.data;
  },

  // Get active sliders
  getActiveHeroSliders: async (): Promise<HeroSlider[]> => {
    const response = await mainAxios.get('/hero-sliders/active/all');
    return response.data;
  }
};