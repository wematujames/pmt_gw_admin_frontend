import { useRouter } from "next/navigation";

export function useLogout() {
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/auth/login");
    };

    return logout;
}
