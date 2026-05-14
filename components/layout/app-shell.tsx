"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Bot, Command, CreditCard, Gauge, Menu, Moon, PieChart, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/layout/command-palette";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

const navItems = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/transactions", label: "Transactions", icon: CreditCard },
  { href: "/budgets", label: "Budgets", icon: PieChart },
  { href: "/advisor", label: "AI Advisor", icon: Bot },
  { href: "/reports", label: "Reports", icon: BarChart3 }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { sidebarCollapsed, setSidebarCollapsed, commandOpen, setCommandOpen } = useAppStore();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandOpen]);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={cn("sticky top-0 hidden h-screen border-r bg-card/80 transition-all duration-300 lg:block", sidebarCollapsed ? "w-20" : "w-72")}>
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">OS</span>
            {!sidebarCollapsed && <span className="font-semibold">Finance OS</span>}
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} aria-label="Toggle sidebar">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("relative flex h-11 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground", active && "bg-muted text-foreground")}
              >
                {active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-md bg-primary/10" />}
                <Icon className="relative h-4 w-4" />
                {!sidebarCollapsed && <span className="relative">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Personal finance command center</p>
            <h1 className="text-lg font-semibold">{navItems.find((item) => item.href === pathname)?.label ?? "Finance OS"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden sm:inline-flex" onClick={() => setCommandOpen(true)}>
              <Command className="h-4 w-4" />
              Cmd K
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="p-4 lg:p-8"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} onSelect={(href) => router.push(href)} />
    </div>
  );
}
