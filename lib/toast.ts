import { toast } from 'sonner';

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      description: options?.description,
      duration: options?.duration || 6000,
      action: options?.action,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      action: options?.action,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
    });
  },

  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      description: options?.description,
    });
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },
};

// Utility functions for common operations
export const toastOperations = {
  create: (itemName: string) => 
    showToast.success(`${itemName} created successfully`),
  
  update: (itemName: string) => 
    showToast.success(`${itemName} updated successfully`),
  
  delete: (itemName: string) => 
    showToast.success(`${itemName} deleted successfully`),
  
  publish: (itemName: string) => 
    showToast.success(`${itemName} published successfully`),
  
  unpublish: (itemName: string) => 
    showToast.success(`${itemName} unpublished successfully`),
  
  error: (operation: string, error?: string) => 
    showToast.error(`Failed to ${operation}`, {
      description: error || 'Please try again or contact support if the problem persists.',
    }),
  
  networkError: () => 
    showToast.error('Network Error', {
      description: 'Please check your internet connection and try again.',
    }),
  
  validationError: (message: string) => 
    showToast.warning('Validation Error', {
      description: message,
    }),
};