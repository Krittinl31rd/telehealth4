import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const store = (set) => ({
  token: null,
  user: null,
  isInitialized: false,

  actionLogin: ({ token, user }) =>
    set({
      token,
      user,
      isInitialized: true,
    }),

  actionLogout: () =>
    set({
      token: null,
      user: null,
      isInitialized: false,
    }),
});

const usePersist = {
  name: "auth",
  storage: createJSONStorage(() => localStorage),
};

const useStore = create(persist(store, usePersist));

export default useStore;
