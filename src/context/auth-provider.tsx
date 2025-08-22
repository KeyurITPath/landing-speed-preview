"use client";

import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import Cookies from "js-cookie";
import { decodeToken, isTokenActive } from "@/utils/helper";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/features/auth.slice";

interface AuthContextProps {
  user: any | null;
  setToken: (newToken: string | null | any) => void;
  removeToken: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setToken: () => {},
  removeToken: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const dispatch = useDispatch();

    // Load token from cookie on mount
  useEffect(() => {
    const storedToken = Cookies.get("token") || null;
    console.log('storedToken', storedToken)
    if (storedToken) {
      setUser(decodeToken(storedToken));
      dispatch(updateUser({
        activeUI: '',
        isLoggedIn: isTokenActive(storedToken),
        ...decodeToken(storedToken),
      }))
    }
  }, [dispatch]);

    // Save token + update user
  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      Cookies.set("token", newToken, { expires: 365, path: "/" }); // 365 days
      setUser(decodeToken(newToken));
    } else {
      Cookies.remove("token");
      setUser(null);
    }
  }, []);

    const removeToken = useCallback(() => {
    Cookies.remove("token");
    setUser(null);
  }, []);

    const contextValue = useMemo(
    () => ({
      user,
      setToken,
      removeToken,
    }),
    [user, setToken, removeToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
