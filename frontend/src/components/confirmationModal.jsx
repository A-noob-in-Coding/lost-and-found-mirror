import { useEffect } from 'react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmShortText,
  cancelShortText,
  type = "default" // "danger", "warning", "default"
}) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Define styles based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          icon: 'fa-exclamation-triangle',
          confirmBg: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          icon: 'fa-exclamation-triangle',
          confirmBg: 'bg-red-600 hover:bg-red-700'
        };
      default:
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          icon: 'fa-question-circle',
          confirmBg: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl max-w-md w-full mx-auto transform transition-all border border-white/20">
        {/* Icon */}
        <div className="flex items-center justify-center pt-6 pb-2">
          <div className={`${styles.iconBg} rounded-full p-3`}>
            <i className={`fas ${styles.icon} ${styles.iconColor} text-xl`}></i>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 text-center mb-6 break-words overflow-hidden" style={{ wordBreak: 'break-word' }}>
            {message}
          </p>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors border border-gray-300"
            >
              <span className="hidden md:inline">{cancelText}</span>
              <span className="inline md:hidden">{cancelShortText ?? cancelText}</span>
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 ${styles.confirmBg} text-white rounded-xl font-medium transition-colors`}>
              <span className="hidden md:inline">{confirmText}</span>
              <span className="inline md:hidden">{confirmShortText ?? confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}