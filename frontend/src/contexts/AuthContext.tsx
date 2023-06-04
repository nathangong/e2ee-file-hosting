import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies, { CookieAttributes } from "js-cookie";
import {
  deleteMasterKey,
  retrieveMasterKey,
  saveMasterKey,
} from "../services/db";
import { exportKey, importKey } from "../services/encryption";

export interface AuthState {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  masterKey: CryptoKey | null;
  setMasterKey: (masterKey: CryptoKey) => void;
}

export const AuthContext = React.createContext<AuthState>({} as AuthState);

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthHandlerProps {
  children: React.ReactNode;
}

export function AuthHandler({ children }: AuthHandlerProps) {
  const [accessToken, setAccessToken] = useState<string | null>("loading");
  const [masterKey, setMasterKey] = useState<CryptoKey | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // files route doesn't interact with auth
    if (location.pathname.includes("files")) return;

    if (accessToken && accessToken !== "loading") {
      navigate("../", { replace: true });

      const cookieOptions: CookieAttributes = {
        expires: 30,
        secure: true,
        sameSite: "strict",
      };

      Cookies.set("accessToken", accessToken, cookieOptions);
      if (masterKey) {
        exportKey(masterKey).then((exportedKey) => {
          saveMasterKey(exportedKey);
        });
      }
    } else if (accessToken === "loading") {
      const tokenCookie = Cookies.get("accessToken");
      retrieveMasterKey().then(async (exportedKey) => {
        if (exportedKey) setMasterKey(await importKey(exportedKey));
        setAccessToken(tokenCookie!);
      });
    } else {
      Cookies.remove("accessToken");
      deleteMasterKey();
    }
  }, [accessToken, navigate, location.pathname, masterKey]);

  const value = {
    accessToken,
    setAccessToken,
    masterKey,
    setMasterKey,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
