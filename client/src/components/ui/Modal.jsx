import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

import styles from './Modal.module.css';

/**
 * Accessible modal dialog built on the native <dialog> element, which gives us
 * focus trapping, Esc-to-close and the top layer for free. Rendered only while
 * `open` is true; `onClose` fires on Esc, backdrop click, or the close button.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {string} props.title - accessible name for the dialog
 */
function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);

  // Keep the native dialog's open state in sync with the `open` prop.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  if (!open) return null;

  // Backdrop clicks land on the <dialog> itself (children sit in an inner box).
  const handleClick = (e) => {
    if (e.target === ref.current) onClose();
  };

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={title}
      onClose={onClose}
      onClick={handleClick}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </dialog>
  );
}

export default Modal;
