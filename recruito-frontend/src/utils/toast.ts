import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string, options = {}) => {
    toast.success(message, {
      duration: 3000,
      icon: '✅',
      ...options,
    });
  },

  error: (message: string, options = {}) => {
    toast.error(message, {
      duration: 3500,
      icon: '❌',
      ...options,
    });
  },

  loading: (message: string, options = {}) => {
    return toast.loading(message, {
      ...options,
    });
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  promise: async (
    promise: Promise<any>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options = {}
  ) => {
    return toast.promise(promise, messages, {
      duration: 3000,
      ...options,
    });
  },

  info: (message: string, options = {}) => {
    toast(message, {
      duration: 3000,
      icon: 'ℹ️',
      ...options,
    });
  },

  warning: (message: string, options = {}) => {
    toast(message, {
      duration: 3000,
      icon: '⚠️',
      ...options,
    });
  },
};

export default showToast;
