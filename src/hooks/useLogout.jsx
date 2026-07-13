'use client';
import { logout } from '../actions/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            localStorage.removeItem(`${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`)
            queryClient.clear();

            router.replace('/auth/sign-in');
        },
        onError: () => {
            localStorage.removeItem(`${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`)
            queryClient.clear();

            router.replace('/auth/sign-in');
        }
    });

    return [logoutMutation.mutate, logoutMutation.isPending];
}