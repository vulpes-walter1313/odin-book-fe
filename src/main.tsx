import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import BaseLayout from "./layouts/BaseLayout.tsx";
import SigninPage from "./pages/SigninPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import FeedPage from "./pages/FeedPage.tsx";
import UsersPage from "./pages/UsersPage.tsx";
import CreatePostPage from "./pages/CreatePostPage.tsx";
import LikedPage from "./pages/LikedPage.tsx";
import SignupPage from "./pages/SignUpPage.tsx";
import ExplorePage from "./pages/ExplorePage.tsx";
import UserPage from "./pages/UserPage.tsx";
import UserFollowingPage from "./pages/UserFollowingPage.tsx";
import UserFollowersPage from "./pages/UserFollowersPage.tsx";
import UserPostsPage from "./pages/UserPostsPage.tsx";
import AccountPage from "./pages/AccountPage.tsx";
import PostPage from "./pages/PostPage.tsx";
import OauthSuccess from "./pages/OauthSuccess.tsx";
import HomePage from "./pages/HomePage.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route index element={<HomePage />} />
            <Route path="signin" element={<SigninPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="feed" element={<FeedPage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="users">
              <Route index element={<UsersPage />} />
              <Route path=":username" element={<UserPage />}>
                <Route index element={<UserPostsPage />} />
                <Route path="following" element={<UserFollowingPage />} />
                <Route path="followers" element={<UserFollowersPage />} />
              </Route>
            </Route>
            <Route path="posts">
              <Route path="create" element={<CreatePostPage />} />
              <Route path=":postId" element={<PostPage />} />
            </Route>
            <Route path="likes" element={<LikedPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="oauth-success" element={<OauthSuccess />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
    </QueryClientProvider>
  </StrictMode>,
);
