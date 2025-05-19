import React, { useEffect } from "react";
import { useNavigate } from "react-router";

interface AuthLayoutProps {
  children: React.ReactNode;
}
function AuthLayout({ children }: AuthLayoutProps) {
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/signin");
    }
  }, []);
  return <>{children}</>;
}

export default AuthLayout;
