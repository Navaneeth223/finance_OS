"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type State = { hasError: boolean };

export class SectionErrorBoundary extends Component<{ children: ReactNode; title?: string }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">{this.props.title ?? "Section unavailable"}</h3>
          <p className="mt-2 text-sm text-muted-foreground">This module failed gracefully. Your session is still intact.</p>
          <Button className="mt-4" variant="outline" onClick={() => this.setState({ hasError: false })}>
            Retry section
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
