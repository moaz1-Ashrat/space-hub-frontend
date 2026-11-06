$ErrorActionPreference = 'Stop'

function Write-FileIfMissing {
    param([string]$Path, [string]$Content)
    $full = Join-Path $PWD $Path
    $dir  = Split-Path $full -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    if (Test-Path $full) {
        Write-Host "SKIP    : $Path" -ForegroundColor Yellow
    } else {
        Set-Content -Path $full -Value $Content -Encoding UTF8
        Write-Host "CREATED : $Path" -ForegroundColor Green
    }
}

Write-Host "`n=== PHASE 4: Coupons Frontend Scaffold ===`n" -ForegroundColor Cyan

Write-FileIfMissing 'src/features/admin/hooks/useAdminCoupons.ts' @"
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import type { CouponFilters } from '../types';

export function useAdminCoupons(filters: CouponFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'coupons', filters],
    queryFn: () => adminService.getCoupons(filters),
  });
}
"@

Write-FileIfMissing 'src/features/admin/hooks/useCreateCoupon.ts' @"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '../services/adminService';
import type { CreateCouponPayload } from '../types';

export function useCreateCoupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCouponPayload) =>
      adminService.createCoupon(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      toast.success('Coupon created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    },
  });
}
"@

Write-FileIfMissing 'src/features/admin/hooks/useUpdateCoupon.ts' @"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '../services/adminService';
import type { UpdateCouponPayload } from '../types';

export function useUpdateCoupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCouponPayload }) =>
      adminService.updateCoupon(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      toast.success('Coupon updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update coupon');
    },
  });
}
"@

Write-FileIfMissing 'src/features/admin/hooks/useDeleteCoupon.ts' @"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '../services/adminService';

export function useDeleteCoupon() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminService.deleteCoupon(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      toast.success('Coupon deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    },
  });
}
"@

Write-FileIfMissing 'src/features/coupons/types/index.ts' @"
export interface Coupon {
  id: number;
  code: string;
  user_id: number | null;
  discount_value: number;
  commission_rate: number | null;
  is_used: boolean;
  expiry_date: string | null;
  used_at: string | null;
  booking_id: number | null;
  created_at: string;
}
"@

Write-FileIfMissing 'src/features/coupons/services/couponService.ts' @"
import apiClient from '@/lib/axios';
import type { Coupon } from '../types';

export const couponService = {
  async myCoupons(): Promise<{ data: Coupon[] }> {
    const { data } = await apiClient.get<{ data: Coupon[] }>('/coupons/my');
    return data;
  },
};
"@

Write-FileIfMissing 'src/features/coupons/hooks/useMyCoupons.ts' @"
import { useQuery } from '@tanstack/react-query';
import { couponService } from '../services/couponService';

export function useMyCoupons() {
  return useQuery({
    queryKey: ['coupons', 'my'],
    queryFn: () => couponService.myCoupons(),
  });
}
"@

Write-Host "`n=== DONE ===`n" -ForegroundColor Cyan
