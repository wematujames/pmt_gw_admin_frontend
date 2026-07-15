"use client";

import { logoutUser } from "@/actions/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient(); 

    const logoutMutation = useMutation({
        mutationFn: async () => logoutUser(),
        onSettled: () => {
            // onSettled runs whether the server logout succeeds or fails.
            // We want to force the user out on the client side regardless.
            try {
                localStorage.removeItem(process.env.NEXT_PUBLIC_API_AUTH_TOKEN!);
                // Clear all queries (like 'current-user') so no cached data leaks
                queryClient.setQueryData(["current-user"], null);
                queryClient.clear()
            } catch (err) {
                console.error("Error clearing local storage", err);
            } finally {
                router.replace(`/auth/login`);
            }
        },
    });

    return { 
        logout: logoutMutation.mutate, 
        isLoading: logoutMutation.isPending 
    };
}