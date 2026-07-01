import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TropaNavbar } from "./Navbar";
import { TropaFooter } from "./Footer";

export function TropaLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return (
    <div className="theme-tropa min-h-screen flex flex-col bg-background text-foreground">
      <TropaNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <TropaFooter />
    </div>
  );
}
