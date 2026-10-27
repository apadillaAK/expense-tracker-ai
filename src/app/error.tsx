"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logger.error("Unhandled UI error", error, { digest: error.digest });
  }, [error]);

  return (
    <div className="card mx-auto max-w-lg p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">Something went wrong</h2>
      <p className="mt-1 text-sm text-slate-500">An unexpected error occurred. Your saved data is safe.</p>
      <button type="button" className="btn-primary mt-6" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
