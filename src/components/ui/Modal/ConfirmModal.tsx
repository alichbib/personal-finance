import { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../Button';
import type { ConfirmModalProps } from './ConfirmModal.types';

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  busy = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-folioOverlay"
      style={{ background: 'rgba(24,24,27,0.32)' }}
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[392px] rounded-card-lg bg-surface p-[26px] shadow-modal animate-folioPop"
      >
        <div className="mb-4 flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-danger-tint">
          <Trash2 size={21} strokeWidth={1.8} className="text-danger" aria-hidden="true" />
        </div>
        <h3
          id="confirm-modal-title"
          className="mb-1.5 text-[17px] font-semibold tracking-[-0.01em] text-ink"
        >
          {title}
        </h3>
        <p className="mb-[22px] text-sm leading-relaxed text-ink-subtle">
          {message}
        </p>
        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
