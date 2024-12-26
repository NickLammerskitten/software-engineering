"use server";

import { createClient } from "@/src/utils/supabase/server";
import { UserRole } from "../models/user-role";

export interface TraderOnlyProps {
    children?: React.ReactNode;
}

export async function TraderOnly({
    children
}: TraderOnlyProps) {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.role !== UserRole.Trader) {
        return null;
    }

    return <>{children}</>;
}
