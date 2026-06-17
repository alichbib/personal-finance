import { useCallback, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { ToastContext } from './toast-context';
import type { ToastState } from './toast-context';

const DISMISS_MS = 2600;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToast({ id, message });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToast((current) => (current && current.id === id ? null : current));
    }, DISMISS_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2.5 rounded-[11px] bg-ink px-4 py-[11px] text-[13.5px] font-medium text-white shadow-toast animate-folioPop"
        >
          <Check size={16} strokeWidth={2.2} className="text-[#34D399]" aria-hidden="true" />
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
