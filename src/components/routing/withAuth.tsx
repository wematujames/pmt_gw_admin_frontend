'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Spin } from 'antd';
import { useUser } from '@/hooks/useUser';

export default function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading, error } = useUser();

    // Ensure this matches the actual route to your Change Password page
    const CHANGE_PASSWORD_ROUTE = '/change-default-password';

    useEffect(() => {
      if (!loading) {
        // 1. Unauthenticated: Redirect to login
        if (!user || error) {
          router.replace('/auth/login');
          return;
        }

        // 2. Authenticated but needs password reset: Redirect to change password
        // (The pathname check prevents an infinite loop if this guard wraps the change-password page itself)
        if (
          user.isPasswordReset === false &&
          pathname !== CHANGE_PASSWORD_ROUTE
        ) {
          router.replace(CHANGE_PASSWORD_ROUTE);
        }
      }
    }, [user, loading, error, router, pathname]);

    // Show spinner while checking auth status
    if (loading) {
      return <Spin fullscreen size="large" description="Verifying access..." />;
    }

    // Prevent content flash before redirects kick in
    if (
      !user ||
      error ||
      (user.isPasswordReset === false && pathname !== CHANGE_PASSWORD_ROUTE)
    ) {
      return null;
    }

    // User is authenticated, authorized, and has reset their password
    return <Component {...props} />;
  };
}