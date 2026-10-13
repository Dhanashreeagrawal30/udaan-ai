import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        let icon = <Info className="w-5 h-5 text-teal-600 flex-shrink-0" />;
        let borderColor = 'border-teal-200';
        let bgIcon = 'bg-teal-50';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
          borderColor = 'border-emerald-200';
          bgIcon = 'bg-emerald-50';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
          borderColor = 'border-amber-200';
          bgIcon = 'bg-amber-50';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
          borderColor = 'border-rose-200';
          bgIcon = 'bg-rose-50';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-white shadow-xl border ${borderColor} transition-all duration-300 animate-in slide-in-from-bottom-3`}
            role="alert"
          >
            <div className={`p-1.5 rounded-lg ${bgIcon}`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[#142B3B]">{toast.title}</h4>
              <p className="text-xs text-[#657582] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
