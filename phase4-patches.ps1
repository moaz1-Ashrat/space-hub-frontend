$ErrorActionPreference = 'Stop'

function Patch-File {
    param([string]$Path, [string]$Marker, [string]$Search, [string]$Replace)
    $full = Join-Path $PWD $Path
    if (-not (Test-Path $full)) { Write-Host "MISSING : $Path" -ForegroundColor Red; return }
    $c = Get-Content -Path $full -Raw -Encoding UTF8
    if ($c -like "*$Marker*") { Write-Host "SKIP    : $Path" -ForegroundColor Yellow; return }
    if ($c -notlike "*$Search*") { Write-Host "WARN    : $Path - pattern not found" -ForegroundColor Magenta; return }
    $c = $c.Replace($Search, $Replace)
    Set-Content -Path $full -Value $c -Encoding UTF8 -NoNewline
    Write-Host "PATCHED : $Path" -ForegroundColor Green
}

function Append-FileIfMissing {
    param([string]$Path, [string]$Marker, [string]$Append)
    $full = Join-Path $PWD $Path
    if (-not (Test-Path $full)) { Write-Host "MISSING : $Path" -ForegroundColor Red; return }
    $c = Get-Content -Path $full -Raw -Encoding UTF8
    if ($c -like "*$Marker*") { Write-Host "SKIP    : $Path" -ForegroundColor Yellow; return }
    Add-Content -Path $full -Value $Append -Encoding UTF8
    Write-Host "PATCHED : $Path" -ForegroundColor Green
}

Write-Host "`n=== PHASE 4 patches ===`n" -ForegroundColor Cyan

# 1) admin/types/index.ts
$couponTypes = @"


// ============================================
// COUPONS (Admin)
// ============================================
export interface AdminCoupon {
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

export interface AdminCouponsPaginated {
  data: AdminCoupon[];
  links: { first: string; last: string; prev: string | null; next: string | null };
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface CouponFilters {
  code?: string;
  user_id?: number;
  is_used?: boolean;
  valid?: boolean;
  page?: number;
}

export interface CreateCouponPayload {
  code: string;
  user_id?: number | null;
  discount_value: number;
  commission_rate?: number | null;
  expiry_date?: string | null;
  is_used?: boolean;
}

export interface UpdateCouponPayload extends Partial<CreateCouponPayload> {}
"@
Append-FileIfMissing 'src/features/admin/types/index.ts' 'AdminCoupon' $couponTypes

# 2) adminService.ts - imports
Patch-File 'src/features/admin/services/adminService.ts' 'AdminCoupon,' @"
  TopCustomer,
} from '../types';
"@ @"
  TopCustomer,
  AdminCoupon,
  AdminCouponsPaginated,
  CouponFilters,
  CreateCouponPayload,
  UpdateCouponPayload,
} from '../types';
"@

# 2b) adminService.ts - methods (before closing brace)
Patch-File 'src/features/admin/services/adminService.ts' 'getCoupons' @"
    return data;
  },
};
"@ @"
    return data;
  },

  // ============================================
  // COUPONS (Admin)
  // ============================================

  async getCoupons(filters: CouponFilters = {}): Promise<AdminCouponsPaginated> {
    const { data } = await apiClient.get<AdminCouponsPaginated>(
      '/admin/coupons',
      { params: filters }
    );
    return data;
  },

  async createCoupon(payload: CreateCouponPayload): Promise<{ data: AdminCoupon; message: string }> {
    const { data } = await apiClient.post<{ data: AdminCoupon; message: string }>('/admin/coupons', payload);
    return data;
  },

  async updateCoupon(id: number, payload: UpdateCouponPayload): Promise<{ data: AdminCoupon; message: string }> {
    const { data } = await apiClient.put<{ data: AdminCoupon; message: string }>(\`/admin/coupons/\${id}\`, payload);
    return data;
  },

  async deleteCoupon(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(\`/admin/coupons/\${id}\`);
    return data;
  },
};
"@

# 3) bookings/types/index.ts - coupon_code
Patch-File 'src/features/bookings/types/index.ts' 'coupon_code' @"
export interface CreateBookingPayload {
  space_id: number;
  start_datetime: string;
  end_datetime: string;
  coupon_id?: number;
}
"@ @"
export interface CreateBookingPayload {
  space_id: number;
  start_datetime: string;
  end_datetime: string;
  coupon_code?: string;
  coupon_id?: number;
}
"@

Write-Host "`n=== Done patches ===`n" -ForegroundColor Cyan