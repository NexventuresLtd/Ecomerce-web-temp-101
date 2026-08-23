import mainAxios from '../Instance/mainAxios';

export const notifyApi = {
  // Admin: send an ad-hoc SMS — the SMS sibling of the WhatsApp/email send buttons.
  sendSms: async (phone: string, message: string): Promise<{ message: string }> => {
    const response = await mainAxios.post(
      `/notify/sms?phone=${encodeURIComponent(phone)}&message=${encodeURIComponent(message)}`
    );
    return response.data;
  },

  // Super Admin: send a custom SMS to a batch of selected users at once.
  sendBulkSms: async (phones: string[], message: string): Promise<{ message: string; sent: string[]; failed: string[] }> => {
    const response = await mainAxios.post('/notify/sms/bulk', { phones, message });
    return response.data;
  },
};
