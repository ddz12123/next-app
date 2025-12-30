import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import { getUserInfoApi } from "@/request/user/user-api";
import { removeToken, getToken } from "@/utils/storage";

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  nickname: string;
  avatar: string;
  status: number;
  role: string;
  created_at: string;
  updated_at: string;
}

interface UserState {
  userInfo: UserInfo | null;
  isLogin: boolean;
}

interface UserActions {
  setUserInfo: (info: UserInfo | null) => void;
  fetchUserInfo: () => Promise<void>;
  logout: () => void;
  checkLoginStatus: () => void;
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    immer((set, get) => ({
      userInfo: null,
      isLogin: false,
      setUserInfo: (info) =>
        set((state) => {
          state.userInfo = info;
          state.isLogin = !!info;
        }),
      fetchUserInfo: async () => {
        // getToken 现在仅从 Cookie 获取
        const token = getToken();
        if (!token) {
          set((state) => {
            state.userInfo = null;
            state.isLogin = false;
          });
          return;
        }
        try {
          const res: any = await getUserInfoApi();
          if (res.code === 200) {
            set((state) => {
              state.userInfo = res.data;
              if (state.userInfo) {
                state.userInfo.avatar = (process.env.NEXT_PUBLIC_STATIC_URL || '') + res.data.avatar;
              }
              state.isLogin = true;
            });
          }
        } catch (error) {
          console.log("Fetch user info failed:", error);
        }
      },
      logout: () => {
        removeToken(); // 现在会清除 Cookie
        set((state) => {
          state.userInfo = null;
          state.isLogin = false;
        });
      },
      checkLoginStatus: () => {
        const token = getToken();
        if (token && !get().isLogin) {
             get().fetchUserInfo();
        } else if (!token && get().isLogin) {
             get().logout();
        }
      }
    })),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
      // 持久化 userInfo 和 isLogin，以确保在页面跳转或刷新时状态正确
      partialize: (state) => ({ 
        userInfo: state.userInfo,
        isLogin: state.isLogin 
      }),
    }
  )
);
