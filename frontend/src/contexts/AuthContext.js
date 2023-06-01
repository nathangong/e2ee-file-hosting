import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { db, retrieveMasterKey, saveMasterKey } from "../services/db";
import { exportKey, importKey } from "../services/encryption";

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthHandler({ children }) {
  const [accessToken, setAccessToken] = useState("loading");
  const [masterKey, setMasterKey] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // files route doesn't interact with auth
    if (location.pathname.includes("files")) return;

    if (accessToken && accessToken !== "loading") {
      navigate("../", { replace: true });

      const cookieOptions = {
        expires: 30,
        secure: true,
        sameSite: "strict",
      };

      Cookies.set("accessToken", accessToken, cookieOptions);
      exportKey(masterKey).then((exportedKey) => {
        saveMasterKey(exportedKey);
      });
    } else if (accessToken === "loading") {
      const tokenCookie = Cookies.get("accessToken");
      retrieveMasterKey().then(async (exportedKey) => {
        if (exportedKey) setMasterKey(await importKey(exportedKey));
        setAccessToken(tokenCookie);
      });
    } else {
      Cookies.remove("accessToken");
      db.masterKey.delete(1);
    }
  }, [accessToken, navigate]);

  const value = {
    accessToken,
    setAccessToken,
    masterKey,
    setMasterKey,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
