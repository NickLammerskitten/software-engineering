"use client";

import { UserRole } from "@/src/app/models/user-role";
import { timestampToDate } from "@/src/app/utils/timestamp-to-date-formatter";
import {Alert, Box, Button, Card, CircularProgress, IconButton, Typography} from "@mui/material";
import { User } from "@supabase/auth-js";
import React, { Fragment, useEffect, useState } from "react";
import {enqueueSnackbar} from "notistack";
import {Add, Delete} from "@mui/icons-material";

export function UserList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([])
    const [userListError, setUserListError] = useState<string>("");

    useEffect(() => {
        setUserListError("");
        fetchUsers();
    }, []);

    const deleteUser = async (userId: string) => {
        setLoading(true);

        await fetch(`/api/user/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            const json = await response.json();
            setLoading(false);

            if (!response.ok) {
                setLoading(false);
                enqueueSnackbar("Fehler beim Löschen des Benutzers." + json.message, { variant: "error" });
                return;
            }

            fetchUsers();
            enqueueSnackbar(json.message, { variant: "success" });
        })
    };

    const fetchUsers = async () => {
        setLoading(true);

        const response = await fetch(`/api/user`);

        const json = await response.json();
        setLoading(false);

        if (!response.ok) {
            setUserListError(`Error while fetching users (${response.status}): ${json["message"]}`);
            return;
        }

        setUsers(json["data"]);
    };

    return (
        <div>
            {loading && <CircularProgress />}

            {!loading && users.length > 0 && (
                <Box className={"items_list"}>
                    <Button
                        startIcon={<Add />}
                        className={"top_action_buttons"}
                        href={`/settings/user/add`}
                    >
                        Benutzer Hinzufügen
                    </Button>
                    {users.map((user) => (
                        <Fragment key={user.id}>
                            <Card
                                key={user.id}
                                className={"item"}
                            >
                                <Box>

                                    <Typography variant={"body1"}>
                                        Email: {user.email}
                                    </Typography>

                                    <Typography variant={"body1"}>
                                        Rolle: {user.role == UserRole.Customer ? "Kunde" : "Händler"}
                                    </Typography>

                                    <Typography variant={"body1"}>
                                        Erstellt am: {timestampToDate(user.created_at)}
                                    </Typography>

                                    <Typography variant={"body1"}>
                                        Letzter login: {user.last_sign_in_at
                                        ? timestampToDate(user.last_sign_in_at)
                                        : 'Nie'}
                                    </Typography>

                                    { user.role == UserRole.Customer &&
                                        <IconButton onClick={() => deleteUser(user.id)}>
                                          <Delete />
                                        </IconButton>
                                    }
                                </Box>
                            </Card>
                        </Fragment>
                    ))}
                </Box>
            )}

            {userListError !== "" &&
                <Alert severity="error">
                    {userListError}
                </Alert>
            }
        </div>
    )
}