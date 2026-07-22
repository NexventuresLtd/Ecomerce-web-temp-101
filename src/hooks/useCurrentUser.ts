import { useState, useEffect } from "react";
import mainAxios from "../Instance/mainAxios";
import { token, getUserInfo } from "../app/Localstorage";

export interface CurrentUser {
  id: number;
  fname: string;
  lname: string;
  email: string;
  phone: string | null;
  profile_pic: string | null;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  is_super_admin: boolean;
  two_factor: boolean;
  provider: string;
  created_at: string;
}

interface UseCurrentUserResult {
  user: CurrentUser | null;
  role: string | null;
  loading: boolean;
}

export function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<CurrentUser | null>(getUserInfo as CurrentUser | null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    mainAxios
      .get<CurrentUser>("/auth/me", { skipAuthRedirect: true } as any)
      .then((res) => {
        setUser(res.data);
        // Keep localStorage in sync so other non-hook code stays consistent
        const store = localStorage.getItem("authToken") ? localStorage : sessionStorage;
        store.setItem("userInfo", JSON.stringify(res.data));
      })
      .catch(() => {
        // Network error — keep showing cached data, don't log out
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    user,
    role: user?.role ?? null,
    loading,
  };
}
