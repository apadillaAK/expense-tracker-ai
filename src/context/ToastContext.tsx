"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface ToastOptions {
  type?: ToastType;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

interface Toast extends ToastOptions {
  id: number;
  type: ToastType;
}

const ToastContext = createContext<((options: ToastOptions) => void) | null>(null);

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden />,
  error: <XCircle className="h-5 w-5 text-rose-500" aria-hidden />,
  info: <Info className="h-5 w-5 text-indigo-500" aria-hidden />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setToasts((current) => [...current.slice(-3), { ...options, type: options.type ?? "success", id }]);
      window.setTimeout(() => dismiss(id), options.action ? 6000 : 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === "error" ? "alert" : "status"}
            className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-xl bg-white p-4 shadow-lg ring-1 ring-slate-900/10"
          >
            {ICONS[t.type]}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">{t.title}</p>
              {t.description && <p className="mt-0.5 text-sm text-slate-500">{t.description}</p>}
            </div>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action?.onClick();
                  dismiss(t.id);
                }}
                className="shrink-0 rounded-md px-2 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used within ToastProvider");
  return toast;
}
