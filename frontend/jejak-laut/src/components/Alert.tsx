import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type AlertProps = {
  message: string;
  onNavigate: () => void;
  show: boolean; // New prop to control when to show toast
};

export const Alert: React.FC<AlertProps> = ({ message, onNavigate, show }) => {
  useEffect(() => {
    if (show) {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: onNavigate
      });
    }
  }, [message, onNavigate, show]);

  return <ToastContainer />;
};