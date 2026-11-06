import apiClient from '@/lib/axios';
import type { Coupon } from '../types';

export const couponService = {
  async myCoupons(): Promise<{ data: Coupon[] }> {
    const { data } = await apiClient.get<{ data: Coupon[] }>('/coupons/my');
    return data;
  },
};
