'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { useUser } from '@/hooks/useUser';

export default function withAuth(Component: React.ComponentType<any>) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const { user, loading, error } = useUser();

    useEffect(() => {
      // 1. If finished loading and no user exists, redirect to login
      if (!loading && (!user || error)) {
        router.replace('/auth/login');
        return;
      }
    }, [user, loading, error, router]); //options

    // Show spinner while checking auth status
    if (loading) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#EDF2EC] gap-4 overflow-hidden">
          return <Spin fullscreen size="large" tip="Verifying access..." />
        </div>
      );
    }

    // If no user, return null (prevent content flash)
    if (!user || error) {
      return null;
    }

    // User is authenticated and authorized; render the component
    return <Component {...props} />;
  };
}