import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
        } else {
            setAuthenticated(true);
        }
    }, [router]);

    return authenticated;
}