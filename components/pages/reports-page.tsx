"use client";

import { Download } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { CategoryDonut, IncomeExpenseChart, YearComparisonChart } from "@/components/charts/report-charts";
import { SectionErrorBoundary } from "@/components/error-boundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportsPage() {
  function exportPdf() {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Finance OS Monthly Report", 20, 24);
    doc.setFontSize(11);
    doc.text("Income, expense, category allocation, and YoY trend summary.", 20, 36);
    doc.text("Net worth: Rs 28,45,000", 20, 54);
    doc.text("Savings rate: 44%", 20, 64);
    doc.text("AI note: Food delivery and shopping remain the highest optimization levers.", 20, 78);
    doc.save("finance-os-report.pdf");
    toast.success("PDF report exported", { action: { label: "Undo", onClick: () => toast.info("Export dismissed") } });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Financial reports</h2>
          <p className="text-sm text-muted-foreground">Exportable, branded charts for monthly reviews.</p>
        </div>
        <Button onClick={exportPdf}><Download className="h-4 w-4" /> Export PDF</Button>
      </div>
      <SectionErrorBoundary title="Income expense chart">
        <Card>
          <CardHeader><CardTitle>Monthly income vs expense</CardTitle></CardHeader>
          <CardContent><IncomeExpenseChart /></CardContent>
        </Card>
      </SectionErrorBoundary>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Category breakdown</CardTitle></CardHeader>
          <CardContent><CategoryDonut /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Year-over-year savings</CardTitle></CardHeader>
          <CardContent><YearComparisonChart /></CardContent>
        </Card>
      </section>
    </div>
  );
}
