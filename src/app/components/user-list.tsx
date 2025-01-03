"use client";

import { UserRole } from "@/src/app/models/user-role";
import { timestampToDate } from "@/src/app/utils/timestamp-to-date-formatter";
import {Alert, Box, Button, Card, CircularProgress, Typography} from "@mui/material";
import { User } from "@supabase/auth-js";
import React, { Fragment, useEffect, useState } from "react";
import {enqueueSnackbar} from "notistack";

export function UserList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([])
    const [userListError, setUserListError] = useState<string>("");

    useEffect(() => {
        setUserListError("");
        fetchUsers();
    }, []);

    const deleteUser = async (user: User) => {
        setLoading(true);

        await fetch(`/api/user`, {
            body: JSON.stringify({ formData: user }),
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            const json = await response.json();
            setLoading(false);

            if (!response.ok) {
                enqueueSnackbar(json.message, { variant: "error" });
                return;
            }

            // Entferne den Benutzer aus der Liste
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
            enqueueSnackbar(json.message, { variant: "success" });
        }).catch((error) => {
            setLoading(false);
            enqueueSnackbar("Fehler beim Löschen des Benutzers." + error.message, { variant: "error" });
        });
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
                                        <Button
                                            variant={"text"}
                                            onClick={() => deleteUser(user)}
                                        >
                                            Löschen
                                        </Button>
                                    }
                                </Box>
                            </Card>
                        </Fragment>
                    ))}

                    <Button
                        variant={"text"}
                        href={`/settings/user/add`}
                    >
                        Benutzer Hinzufügen
                    </Button>
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