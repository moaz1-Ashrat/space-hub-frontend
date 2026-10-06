import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookingDraft {
  spaceId: number | null;
  startDate: string | null;
  endDate: string | null;
  guestCount: number;
  couponId: number | null;
}

interface BookingDraftState {
  draft: BookingDraft;
  setDraft: (draft: Partial<BookingDraft>) => void;
  clearDraft: () => void;
}

const initialDraft: BookingDraft = {
  spaceId: null,
  startDate: null,
  endDate: null,
  guestCount: 1,
  couponId: null,
};

export const useBookingDraftStore = create<BookingDraftState>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (partial) =>
        set((state) => ({
          draft: { ...state.draft, ...partial },
        })),

      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'space-hub-booking-draft',
    }
  )
);