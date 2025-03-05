import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import BaseLayout from "./layouts/BaseLayout.tsx";
import SigninPage from "./pages/SigninPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import FeedPage from "./pages/FeedPage.tsx";
import UsersPage from "./pages/UsersPage.tsx";
import CreatePostPage from "./pages/CreatePostPage.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route index element={<App />} />
            <Route path="signin" element={<SigninPage />} />
            <Route path="feed" element={<FeedPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="posts/create" element={<CreatePostPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
    </QueryClientProvider>
  </StrictMode>,
);
