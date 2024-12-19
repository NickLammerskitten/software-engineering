"use client"

import { signOutAction } from "@/src/app/actions";
import { UserRole } from "@/src/app/models/user-role";
import { AccountInitials } from "@/src/app/utils/account-initials";
import { Logout, Settings } from "@mui/icons-material";
import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { User } from "@supabase/auth-js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./account-menu.module.css";

export function AccountMenu({ user }: { user: User }) {
    const router = useRouter();

    const [userInitials, setUserInitials] = useState<string | null>();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        const accountInitials = AccountInitials(user);
        setUserInitials(accountInitials);
    }, [user]);

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
            <Box className={styles.account_menu_wrapper}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar className={styles.avatar}>
                            {userInitials}
                        </Avatar>
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
                <MenuItem onClick={() => handleNavigate("/profile")}
                          className={styles.menu_item}
                >
                    <Avatar className={styles.avatar}>{userInitials}</Avatar> Profil
                </MenuItem>

                <Divider />

                {user.role === UserRole.Trader && (
                    <MenuItem onClick={() => handleNavigate("/settings")}
                              className={styles.menu_item}
                    >
                        <Settings /> Einstellungen
                    </MenuItem>
                )}

                <MenuItem onClick={() => signOutAction()}
                          className={styles.menu_item}
                >
                    <Logout /> Ausloggen
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}