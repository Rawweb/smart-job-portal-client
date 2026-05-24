import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  title,
  description,
  children,
  footer,
  onClose,
  closeOnOverlay = true,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <button
        type='button'
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        aria-label='Close modal'
        onClick={closeOnOverlay ? onClose : undefined}
      />

      <section
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        className='relative w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-modal'
      >
        <div className='flex items-start gap-4'>
          <div className='min-w-0 flex-1'>
            {title && (
              <h2
                id='modal-title'
                className='text-lg font-semibold text-text-heading'
              >
                {title}
              </h2>
            )}

            {description && (
              <p id='modal-description' className='mt-2 text-sm text-text'>
                {description}
              </p>
            )}
          </div>

          <button
            type='button'
            onClick={onClose}
            className='shrink-0 rounded p-1.5 text-text-muted transition hover:bg-border hover:text-text-heading'
            aria-label='Close modal'
          >
            <X size={18} />
          </button>
        </div>

        {children && <div className='mt-5'>{children}</div>}

        {footer && (
          <div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
            {footer}
          </div>
        )}
      </section>
    </div>,
    document.body
  );
};

export default Modal;
