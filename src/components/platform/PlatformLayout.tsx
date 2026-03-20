import { Outlet } from "react-router-dom";
import PlatformNavbar from "./PlatformNavbar";
import PlatformFooter from "./PlatformFooter";

const PlatformLayout = () => (
  <div className="min-h-screen flex flex-col">
    <PlatformNavbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <PlatformFooter />
  </div>
);

export default PlatformLayout;
