\# Space Hub Frontend — Fixes to Do Later



\## 🔴 High Priority



\### 1. Forgot Password / Reset Password

\- \[ ] Backend: Add `/api/v1/auth/forgot-password` endpoint

\- \[ ] Backend: Add `/api/v1/auth/reset-password` endpoint

\- \[ ] Frontend: Wire ForgotPasswordPage to real API

\- \[ ] Frontend: Wire ResetPasswordPage to real API



\### 2. Owner Seeder Login Issue

\- \[ ] `owner@spacehub.test` returns "Invalid email or password"

\- \[ ] Check DatabaseSeeder password value

\- \[ ] Verify password matches Postman tests

\- \[ ] Update Postman environment if needed



\## 🟡 Medium Priority



\### 3. Features Endpoint Missing

\- \[ ] Backend: Add `GET /api/v1/features` endpoint

\- \[ ] Frontend: Wire Create/Edit Space to fetch features



\### 4. Naming Consistency

\- \[ ] Decide: "Login" vs "Sign in" — unify across UI

\- \[ ] Same for "Register" vs "Sign up"



\### 5. Booking Form on Space Detail

\- \[ ] Add date picker to SpaceDetailPage

\- \[ ] Implement `POST /bookings` from frontend

\- \[ ] Wire to booking flow



\## 🟢 Low Priority



\### 6. Form UX

\- \[ ] Password show/hide toggle

\- \[ ] Phone input mask

\- \[ ] Better form errors from API 422



\### 7. shadcn Import Issues (1 Problem)

\- \[ ] Check remaining TypeScript warning



\## 📋 Stage Progress

\- \[x] Stage 1: Foundation

\- \[x] Stage 2: Auth + Architecture

\- \[x] Stage 3: Public Discovery

\- \[x] Stage 4: Customer Dashboard

\- \[x] Stage 5: Owner Dashboard

\- \[ ] Stage 6: Admin

\- \[ ] Stage 7: Polish

\- \[ ] Stage 8: QA

## 🟡 Medium Priority

### Admin — All Spaces Page
- [ ] Backend: Add `GET /api/v1/admin/spaces` (with approval_status filter)
- [ ] Frontend: Add `/admin/spaces` page
- [ ] Re-add "All Spaces" to Admin sidebar

### Admin — Settings Page
- [ ] Backend: Add settings endpoints (commission, payment, email, etc.)
- [ ] Backend: Add `GET/PUT /admin/settings`
- [ ] Frontend: Replace placeholder with real forms
- [ ] Wire to backend

### Booking Time Display Bug
- [ ] Booking dialog shows 10:00 but booking detail shows 13:00
- [ ] Check: timezone in datetime-local input
- [ ] Fix: format datetime in correct timezone


- [ ] Fix timezone display: booking shows 13:00 instead of 10:00
- [ ] Check: app timezone in config/app.php (should be 'Africa/Cairo')
- [ ] Check: BookingResource start_time cast