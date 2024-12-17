import { AccountInitials } from "@/src/app/utils/account-initials";
import { User } from "@supabase/auth-js";
import { expect, test } from "vitest";

test('account-initials user with dot', async () => {
    const user = {
        email: 'test.user@email.com'
    } as User;

    const initials = AccountInitials(user);

    expect(initials).toBe('TU');
});

test('account-initials user without dot', async () => {
    const user = {
        email: 'test@email.com'
    } as User;

    const initials = AccountInitials(user);

    expect(initials).toBe('T');
});