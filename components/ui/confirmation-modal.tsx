import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, Edit, Plus, Archive, Send } from 'lucide-react';

export interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  icon?: 'delete' | 'edit' | 'add' | 'unpublish' | 'publish' | 'warning' | 'none';
  loading?: boolean;
}

const variantStyles = {
  default: {
    button: 'bg-primary hover:bg-primary/90',
    icon: 'text-primary',
  },
  destructive: {
    button: 'bg-destructive hover:bg-destructive/90',
    icon: 'text-destructive',
  },
  warning: {
    button: 'bg-orange-600 hover:bg-orange-700',
    icon: 'text-orange-600',
  },
  success: {
    button: 'bg-green-600 hover:bg-green-700',
    icon: 'text-green-600',
  },
};

const iconMap = {
  delete: Trash2,
  edit: Edit,
  add: Plus,
  unpublish: Archive,
  publish: Send,
  warning: AlertTriangle,
  none: null,
};

export default function ConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  icon = 'warning',
  loading = false,
}: ConfirmationModalProps) {
  const styles = variantStyles[variant];
  const IconComponent = iconMap[icon];

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3">
            {IconComponent && (
              <div className={`p-2 rounded-full bg-gray-100 ${styles.icon}`}>
                <IconComponent className="h-5 w-5" />
              </div>
            )}
            <div>
              <AlertDialogTitle className="text-lg font-semibold">
                {title}
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex space-x-2">
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={loading}>
              {cancelText}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className={styles.button}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Processing...' : confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}