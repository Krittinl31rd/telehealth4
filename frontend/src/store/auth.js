import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const store = (set) => ({
  token: null,
  user: null,
  isInitialized: false,

  actionLogin: ({ token }) =>
    set({
      token,
      isInitialized: true,
    }),

  actionLogout: () =>
    set({
      token: null,
      user: null,
      isInitialized: false,
    }),

  actionUser: ({ user }) =>
    set({
      user,
    }),

  actionDoctorStatus: ({ status }) =>
    set((state) => ({
      user: {
        ...state.user,
        doctor_profile: {
          ...state.user?.doctor_profile,
          status: status,
        },
      },
    })),
});

const usePersist = {
  name: "auth",
  storage: createJSONStorage(() => localStorage),
};

const useStore = create(persist(store, usePersist));

export default useStore;
