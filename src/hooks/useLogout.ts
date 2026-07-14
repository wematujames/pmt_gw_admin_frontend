import { logoutUser } from "@/actions/auth";
import { useRouter } from "next/navigation";

export function useLogout() {
    const router = useRouter();

    const logout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            
        } finally {
            localStorage.removeItem(process.env.NEXT_PUBLIC_API_AUTH_TOKEN!);
            router.push(`/auth/login`);
        }
    };

    return logout;
}
