import { UserRole } from "@/src/app/models/userRole";
import WrongUserRole from "@/src/app/utils/wrongUserRole";
import { createClient } from "@/src/utils/supabase/server";

export default async function Portfolio() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

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
