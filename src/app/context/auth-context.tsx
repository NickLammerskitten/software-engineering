'use client';

import { logout } from "@/src/app/(auth-pages)/login/actions";
import { createClient } from "@/src/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface AuthContextProps {
    user: User | undefined;
    logOut: () => void;
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

    supabase.auth.onAuthStateChange(((event) => {
        setTimeout(async () => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                supabase.auth.getUser().then((user) => {
                    setUser(user.data.user ?? undefined)

                    if (!user) {
                        router.push('/login')
                    } else {
                        router.push('/')
                    }
                });
            }
        }, 0)
    }));

    const logOut = async () => {
        await logout();
    }

    return (
        <AuthContextComp.Provider
            value={{
                user: user,
                logOut: logOut,
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