import { ReactNode } from "react";
import { Header } from "./Header";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div
        className={`flex-1 ${
          isChatPage ? "overflow-hidden" : "overflow-y-auto p-10"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
