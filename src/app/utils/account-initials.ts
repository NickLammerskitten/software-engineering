import { User } from "@supabase/auth-js";

export const AccountInitials = (user: User) => {
    if (!user.email) {
        return "";
    }

    const emailParts = user.email.split("@");
    const initials = emailParts[0].split(".");
    return initials.map((i) => i[0]).join("").toUpperCase();
}