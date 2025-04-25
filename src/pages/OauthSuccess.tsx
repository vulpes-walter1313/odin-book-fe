import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

function OauthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    if (accessToken && refreshToken) {
      console.log("setting auth tokens");
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log("navigating to /feed");
      navigate("/feed");
    } else {
      console.log("navigating to /signin");
      navigate("/signin");
    }
  }, [searchParams, navigate]);
  return (
    <div>
      <h1>Redirecting you soon...</h1>
      <div className="text-green-800">
        <p>{searchParams.get("accessToken")}</p>
        <p>{searchParams.get("refreshToken")}</p>
      </div>
    </div>
  );
}

export default OauthSuccess;
