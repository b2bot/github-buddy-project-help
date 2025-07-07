
import { Button } from "@/components/ui/button";
import { Moon, Sun, PenTool } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-primary">
            <PenTool className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">SEO Writer</h1>
            <p className="text-xs text-muted-foreground">Ferramenta Interna</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/posts" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>
            Posts
          </NavLink>
          <NavLink to="/strategy" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>
            Estratégia
          </NavLink>
		  <NavLink to="/strategyv2" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>
            StrategyV2
          </NavLink>
          <NavLink to="/integrations" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>
            Integrações
          </NavLink>
          <NavLink to="/manual" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>
            Manual
          </NavLink>
		  <NavLink to="/chat" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>
            Chat
          </NavLink>
          <NavLink to="/performance" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>
            Performance
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>
            Analytics
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>
            Configurações
          </NavLink>
        </nav>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
