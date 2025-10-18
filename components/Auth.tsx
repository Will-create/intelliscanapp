import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Redirect, Slot } from 'expo-router';

export const Auth = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return <>{children}</>;
};
