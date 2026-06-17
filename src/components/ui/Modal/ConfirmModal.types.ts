export interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Disables actions and shows a deleting state while the request runs. */
  busy?: boolean;
}
