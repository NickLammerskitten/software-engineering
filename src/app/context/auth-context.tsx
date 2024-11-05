'use client';

import { createClient } from "@/src/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface AuthContextProps {
    user: User | undefined;
}

interface AuthContextProviderProps {
    children: React.ReactNode;
}

const AuthContextComp = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProviderContext: React.FC<AuthContextProviderProps> = ({
    children,
}) => {
    const router = useRouter();
    const supabase = createClient()

    const [user, setUser] = useState<User | undefined>(undefined);

    React.useEffect(() => {
        supabase.auth.getUser().then((user) => {
            const userData = user.data.user ?? undefined;
            setUser(userData)

            if (!userData) {
                router.push('/login')
            } else {
                router.push('/')
            }
        })
    }, [supabase.auth])

    return (
        <AuthContextComp.Provider
            value={{
                user: user,
            }}
        >
            {children}
        </AuthContextComp.Provider>
    )
}

export const useAuthContext = () => {
    const context = React.useContext(AuthContextComp);

    if (!context) {
        throw new Error("useCurrencyContext must be used within a CurrencyProvider");
    }

    return context;
}