import React, { useEffect } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { X, Check, AlertTriangle, HelpCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'hint';

interface ToastProps {
  type: ToastType;
  message: string;
  subMessage?: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, subMessage, onClose }) => {
  const [scope, animate] = useAnimate();

  const toastConfig = {
    success: {
      bgColor: 'bg-emerald-500',
      icon: <Check className="w-6 h-6 text-white" />,
      iconBg: 'bg-emerald-600',
    },
    error: {
      bgColor: 'bg-rose-500',
      icon: <X className="w-6 h-6 text-white" />,
      iconBg: 'bg-rose-600',
    },
    warning: {
      bgColor: 'bg-amber-500',
      icon: <AlertTriangle className="w-6 h-6 text-white" />,
      iconBg: 'bg-amber-600',
    },
    hint: {
      bgColor: 'bg-blue-500',
      icon: <HelpCircle className="w-6 h-6 text-white" />,
      iconBg: 'bg-blue-600',
    },
  };

  const { bgColor, icon, iconBg } = toastConfig[type];

  useEffect(() => {
    const enterAnimation = async () => {
      await animate(scope.current, { scale: [0.8, 1.2, 1], opacity: [0, 1] }, { duration: 0.5 });
      await animate('div', { x: [0, 10, -10, 10, -10, 0] }, { duration: 0.5 });
    };

    enterAnimation();

    const timer = setTimeout(() => {
      animate(scope.current, { x: 100, opacity: 0 }, { duration: 0.5 }).then(onClose);
    }, 4000);

    return () => clearTimeout(timer);
  }, [animate, onClose, scope]);

  return (
    <motion.div
      ref={scope}
      className={`flex items-center p-4 rounded-full shadow-lg ${bgColor} text-white max-w-sm overflow-hidden`}
      layout
    >
      <div className={`flex-shrink-0 mr-3 p-2 rounded-full ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-grow mr-3">
        <h3 className="font-bold text-lg">{message}</h3>
        {subMessage && <p className="text-sm opacity-90">{subMessage}</p>}
      </div>
      <button onClick={onClose} className="flex-shrink-0 text-white hover:text-gray-200">
        <X className="w-7 h-7" />
      </button>
    </motion.div>
  );
};

export default Toast;