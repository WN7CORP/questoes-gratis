
import React from 'react';
import { Toaster } from "@/components/ui/sonner";

const EnhancedToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          background: '#1F1F1F',
          border: '1px solid #333333',
          color: '#FFFFFF',
        },
        className: 'bg-netflix-card border-netflix-border text-white',
      }}
    />
  );
};

export default EnhancedToastProvider;
