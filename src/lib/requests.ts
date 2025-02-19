import { getBEUrl } from "./envVariables";
import { NoAccessTokenError } from "./errors";

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const res = await fetch(`${getBEUrl()}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      mode: "cors",
    });

    if (!res.ok) {
      throw new Error("Refresh token expired");
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await res.json();
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    return newAccessToken;
  } catch (err) {
    console.error("Token refresh failed: ", err);
    logout();
  }
};

export const makeRequestWithAuth = async (
  url: string,
  options: RequestInit,
) => {
  console.log("makeRequestWithAuth hit.");
  let accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new NoAccessTokenError("Access Token Not Found");
  }
  // TODO: check accessToken expiration to refresh accessToken
  const accessExp = JSON.parse(atob(accessToken.split(".")[1])).exp;
  const now = Math.floor(Date.now() / 1000);
  if (accessExp - now < 60) {
    console.log("refreshing token due to being close to invalid");
    accessToken = await refreshAccessToken();
  }

  const newHeaders = new Headers(options.headers);
  newHeaders.set("Authorization", `Bearer ${accessToken}`);

  const newOptions = {
    ...options,
    headers: newHeaders,
  };
  const res = await fetch(`${getBEUrl()}${url}`, newOptions);
  // if (res.status == 401) {
  //   accessToken = await refreshAccessToken();
  //
  //   if (!accessToken) return res;
  //   // retry
  //   newOptions.headers.set("Authorization", `Bearer ${accessToken}`);
  //   res = await fetch(`${getBEUrl()}${url}`, newOptions)
  // }
  return res;
};
