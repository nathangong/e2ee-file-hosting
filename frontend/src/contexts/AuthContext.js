import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthHandler({ children }) {
  const [accessToken, setAccessToken] = useState("loading");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // files route doesn't interact with auth
    if (location.pathname.includes("files")) return;

    if (accessToken && accessToken !== "loading") {
      navigate("../", { replace: true });

      Cookies.set("accessToken", accessToken, { expires: 30 });
    } else if (accessToken === "loading") {
      const tokenCookie = Cookies.get("accessToken");
      setAccessToken(tokenCookie);
    } else {
      Cookies.remove("accessToken");
    }
  }, [accessToken, navigate]);

  const value = {
    accessToken,
    setAccessToken,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
