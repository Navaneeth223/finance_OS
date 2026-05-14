"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Bot, Command, CreditCard, Gauge, Menu, Moon, PanelLeftClose, PanelLeftOpen, PieChart, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={cn("sticky top-0 hidden h-screen flex-col border-r bg-card/80 transition-all duration-300 lg:flex", sidebarCollapsed ? "w-20" : "w-72")}>
        <div className={cn("flex h-16 items-center px-4", sidebarCollapsed ? "justify-center" : "justify-start")}>
          <Link href="/" className={cn("flex min-w-0 items-center gap-3", sidebarCollapsed && "justify-center")}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">OS</span>
            {!sidebarCollapsed && <span className="font-semibold">Finance OS</span>}
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
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
        <div className="border-t p-3">
          <Button
            variant="ghost"
            className={cn("w-full", sidebarCollapsed ? "px-0" : "justify-start")}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            {!sidebarCollapsed && <span>Collapse sidebar</span>}
          </Button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation menu">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <p className="hidden text-xs uppercase tracking-[0.24em] text-muted-foreground sm:block">Personal finance command center</p>
              <h1 className="truncate text-lg font-semibold">{navItems.find((item) => item.href === pathname)?.label ?? "Finance OS"}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden sm:inline-flex" onClick={() => setCommandOpen(true)}>
              <Command className="h-4 w-4" />
              Cmd K
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
              {mounted ? resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" /> : <span className="h-4 w-4" />}
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
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-2rem))] flex-col border-r bg-card shadow-xl lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              <div className="flex h-16 items-center justify-between border-b px-4">
                <Link href="/" className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">OS</span>
                  <span className="truncate font-semibold">Finance OS</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu">
                  <X className="h-5 w-5" />
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
                      className={cn("relative flex h-12 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground", active && "bg-muted text-foreground")}
                    >
                      {active && <motion.span layoutId="mobile-nav-pill" className="absolute inset-0 rounded-md bg-primary/10" />}
                      <Icon className="relative h-5 w-5 shrink-0" />
                      <span className="relative truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto border-t p-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCommandOpen(true);
                  }}
                >
                  <Command className="h-4 w-4" />
                  Command palette
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} onSelect={(href) => router.push(href)} />
    </div>
  );
}
