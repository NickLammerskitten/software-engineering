"use client";

import { UserRole } from "@/src/app/models/user-role";
import { timestampToDate } from "@/src/app/utils/timestamp-to-date-formatter";
import {Alert, Box, Button, Card, CircularProgress, Typography} from "@mui/material";
import { User } from "@supabase/auth-js";
import { Fragment, useEffect, useState } from "react";

export function UserList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([])
    const [userListError, setUserListError] = useState<string>("");

    useEffect(() => {
        setUserListError("");
        fetchUsers();
    }, []);

    const deleteUser = async (userId: string)=> {
        console.log(userId);

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
                                            onClick={deleteUser(user.id)}
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