'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { useUser } from '@/hooks/useUser';

export default function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const { user, loading, error } = useUser();

    useEffect(() => {
      // If finished loading and no user exists, redirect to login
      if (!loading && (!user || error)) {
        router.replace('/auth/login');
      }
    }, [user, loading, error, router]);

    // Show spinner while checking auth status
    if (loading) {
      return <Spin fullscreen size="large" tip="Verifying access..." />;
    }

    // If no user, return null to prevent content flash before redirect kicks in
    if (!user || error) {
      return null;
    }

    // User is authenticated and authorized; render the component
    return <Component {...props} />;
  };
}