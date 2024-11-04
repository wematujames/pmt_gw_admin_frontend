import { logoutUser } from "@/actions/auth";
import { useRouter } from "next/navigation";

export function useLogout(type: string) {
    const router = useRouter();

    const logout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            
        } finally {
            localStorage.removeItem(`nerasol-token`);
            router.push(`/auth/login`);
        }
    };

    return logout;
}
