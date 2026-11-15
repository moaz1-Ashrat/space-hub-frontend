import apiClient from '@/lib/axios';
import type { PaymentsPaginated } from '../types';

export const paymentService = {
  async history(page = 1): Promise<PaymentsPaginated> {
    const { data } = await apiClient.get('/payments', { params: { page } });
    return data;
  },

  async initiateKashier(paymentId: number) {
    const { data } = await apiClient.post('/payments/kashier/initiate', { payment_id: paymentId });
    return data;
  },

  async refund(paymentId: number, reason: string) {
    const { data } = await apiClient.post(`/payments/${paymentId}/refund`, { reason });
    return data;
  },

    
  async payWithCash(paymentId: number) {
    const { data } = await apiClient.post('/payments/cash', { payment_id: paymentId });
    return data;
  },
  async downloadInvoice(paymentId: number) {
    try {
      const response = await apiClient.get(`/payments/${paymentId}/invoice`, {
        responseType: 'blob', // استقبال الملف كـ Blob
      });

      // إنشاء رابط مؤقت وتحميله
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

    } catch (error) {
      console.error('Download failed', error);
      throw error;
    }
  }
};