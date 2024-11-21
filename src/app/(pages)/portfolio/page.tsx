import { UserRole } from "@/src/app/models/userRole";
import WrongUserRole from "@/src/app/utils/wrongUserRole";
import { User } from "@supabase/auth-js";

export default function Portfolio() {
    // TODO: Get user
    const user: User | null = null;

    return (
        <div>
            {user?.role === UserRole.Customer ? (
                <>
                    Meine Mappe
                </>
            ) : (
                <WrongUserRole />
            )}
        </div>
    );
}
