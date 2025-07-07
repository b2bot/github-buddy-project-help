import { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}