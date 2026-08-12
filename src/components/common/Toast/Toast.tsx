import React from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import './Toast.css';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          <div className="toast__icon">
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'warning' && <AlertTriangle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
          </div>
          <div className="toast__message">{toast.message}</div>
          <button 
            className="toast__close" 
            onClick={() => removeToast(toast.id)}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
