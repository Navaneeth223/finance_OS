"use client";

import { Command as CommandPrimitive } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { BarChart3, Bot, CreditCard, Gauge, PieChart } from "lucide-react";

const actions = [
  { href: "/", label: "Open dashboard", icon: Gauge },
  { href: "/transactions", label: "Review transactions", icon: CreditCard },
  { href: "/budgets", label: "Plan budgets", icon: PieChart },
  { href: "/advisor", label: "Ask AI advisor", icon: Bot },
  { href: "/reports", label: "Export reports", icon: BarChart3 }
];

export function CommandPalette({
  open,
  onOpenChange,
  onSelect
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (href: string) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-20 z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 rounded-lg border bg-card p-0 shadow-2xl">
        <Dialog.Title className="sr-only">Command palette</Dialog.Title>
        <CommandPrimitive className="overflow-hidden rounded-lg">
          <CommandPrimitive.Input className="h-14 w-full border-b bg-transparent px-4 outline-none" placeholder="Search Finance OS..." />
          <CommandPrimitive.List className="max-h-80 overflow-y-auto p-2">
            <CommandPrimitive.Empty className="p-6 text-center text-sm text-muted-foreground">No action found.</CommandPrimitive.Empty>
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <CommandPrimitive.Item
                  key={action.href}
                  value={action.label}
                  onSelect={() => {
                    onSelect(action.href);
                    onOpenChange(false);
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-3 text-sm outline-none aria-selected:bg-muted"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {action.label}
                </CommandPrimitive.Item>
              );
            })}
          </CommandPrimitive.List>
        </CommandPrimitive>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
