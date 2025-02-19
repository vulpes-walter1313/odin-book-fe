import Navbar from "@/components/Navbar";
import React from "react";
import { Outlet } from "react-router";

function BaseLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default BaseLayout;
