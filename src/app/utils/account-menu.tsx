"use client"

import { signOutAction } from "@/src/app/actions";
import { Logout } from "@mui/icons-material";
import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

export function AccountMenu() {
    const router = useRouter();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (href: string) => {
        router.push(href);
        handleClose();
    }

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
            >
                <MenuItem onClick={() => handleNavigate("/profile")}>
                    <Avatar /> Profil
                </MenuItem>

                <Divider />

                <MenuItem onClick={() => signOutAction()}>
                    <Logout /> Ausloggen
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}