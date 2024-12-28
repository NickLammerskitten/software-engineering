import { DetailedImage } from "@/src/app/components/detailed-image";
import { UserRole } from "@/src/app/models/user-role";
import { createClient } from "@/src/utils/supabase/server";

export default async function DetailPage() {
    const supabaseClient = await createClient();

    const { data: { user } } = await supabaseClient
        .auth
        .getUser();

    return (
        <>
            {user && (
                <DetailedImage isTrader={user.role === UserRole.Trader} />
            )}
        </>
    );
}