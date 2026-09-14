import mainAxios from '../Instance/mainAxios';

export interface Recipient { id: number; name: string; contact: string }
export interface SendFailure { recipient: string; reason: string }
export interface BulkSendResult { message: string; sent: string[]; failed: string[]; failures: SendFailure[] }

export const notifyApi = {
  // Admin: send an ad-hoc SMS — the SMS sibling of the WhatsApp/email send buttons.
  sendSms: async (phone: string, message: string): Promise<{ message: string }> => {
    const response = await mainAxios.post(
      `/notify/sms?phone=${encodeURIComponent(phone)}&message=${encodeURIComponent(message)}`
    );
    return response.data;
  },

  // Super Admin: send a custom SMS to a batch of selected users at once.
  sendBulkSms: async (phones: string[], message: string): Promise<BulkSendResult & {
    invalid: string[]; segments_per_recipient: number; credits_used: number;
  }> => {
    const response = await mainAxios.post('/notify/sms/bulk', { phones, message });
    return response.data;
  },

  // Super Admin: one email to a batch of users (max 50 per call).
  sendBulkEmail: async (recipients: { email: string; name?: string }[], subject: string, message: string): Promise<BulkSendResult> => {
    const response = await mainAxios.post('/notify/email/bulk', { recipients, subject, message });
    return response.data;
  },

  // Super Admin: everyone reachable on a channel — the "send to all" audience.
  getRecipients: async (channel: 'sms' | 'email'): Promise<{ channel: string; count: number; recipients: Recipient[] }> => {
    const response = await mainAxios.get('/notify/recipients', { params: { channel } });
    return response.data;
  },

  // Admin: send an ad-hoc email to a single user — the email sibling of sendSms.
  sendEmail: async (email: string, subject: string, message: string, recipientName = ''): Promise<{ message: string }> => {
    const response = await mainAxios.post('/notify/email', { email, subject, message, recipient_name: recipientName });
    return response.data;
  },
};
