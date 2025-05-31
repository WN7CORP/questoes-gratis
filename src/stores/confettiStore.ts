
import { create } from 'zustand';

interface ConfettiStore {
  isActive: boolean;
  pop: () => void;
  reset: () => void;
}

export const useConfettiStore = create<ConfettiStore>((set) => ({
  isActive: false,
  pop: () => {
    set({ isActive: true });
    setTimeout(() => set({ isActive: false }), 3000);
  },
  reset: () => set({ isActive: false }),
}));
