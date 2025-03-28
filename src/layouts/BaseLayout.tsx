import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router";

function BaseLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
}

export default BaseLayout;
