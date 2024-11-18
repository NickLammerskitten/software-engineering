'use client';

import { useAuthContext } from "@/src/app/context/auth-context";
import { Button } from "@mui/material";
import React from "react";

export default function Home() {
    const { logOut } = useAuthContext();

    return (
        <div>
            <Button
                variant={"text"}
                onClick={logOut}
            >
                Ausloggen
            </Button>
        </div>
    )
}
