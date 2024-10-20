'use client';

import AccountForm from "@/src/app/components/account-form";
import { Link } from "@mui/material";
import { type User } from '@supabase/supabase-js'
import React, { useState } from "react";
import { createClient } from "../utils/supabase/client";

export default function Home() {
    const supabase = createClient()

    const [user, setUser] = useState<User | undefined>(undefined)

    React.useEffect(() => {
        supabase.auth.getUser().then((user) => {
            const userData = user.data.user ?? undefined;
            setUser(userData)
        })
    }, [])

    return (
        <div>
            {user ? (
                <AccountForm user={user} />
            ) : (
                <div>
                    <h1>Home</h1>
                    <p>
                        You are not logged in.
                    </p>
                    <Link href={'/login'}>
                        Login
                    </Link>
                </div>
            )}
        </div>
    )
}
