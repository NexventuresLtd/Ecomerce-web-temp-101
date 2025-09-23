// services/billingService.ts

import mainAxios from "../../Instance/mainAxios";

// Add auth token to requests
mainAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Adjust based on your token storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface BillingData {
  full_name: string;
  billing_type: 'phone' | 'card' | 'paypal' | 'bank_transfer' | 'Other';
  card_number?: string;
  expiry_date?: string;
  cvv?: string;
  address?: string;
  city?: string;
  zip_code?: string;
  country?: string;
}

export interface BillingRecord extends BillingData {
  id: number;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export const billingService = {
  // Add new billing method
  async addBilling(billingData: BillingData) {
    const response = await mainAxios.post('/billing/add', null, {
      params: billingData
    });
    return response.data;
  },

  // Get user's billing methods
  async getMyBillings() {
    const response = await mainAxios.get('/billing/my-billings');
    return response.data;
  },

  // Update billing method
  async updateBilling(billingId: number, billingData: Partial<BillingData>) {
    const response = await mainAxios.put(`/billing/update/${billingId}`, null, {
      params: billingData
    });
    return response.data;
  },

  // Delete billing method
  async deleteBilling(billingId: number) {
    const response = await mainAxios.delete(`/billing/delete/${billingId}`);
    return response.data;
  },

  // Get all billings (admin only)
  async getAllBillings() {
    const response = await mainAxios.get('/billing/all');
    return response.data;
  }
};