"use client"

import { loadUser } from "@/actions/auth";
import { useQuery } from '@tanstack/react-query';

export function useUser() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['current-user'],
        queryFn: loadUser,
        retry: false,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true
    });

    return { user: data, loading: isLoading, error: isError, };
}