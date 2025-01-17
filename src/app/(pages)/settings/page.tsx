import { Box, Button, Typography } from "@mui/material";
import {createClient} from "@/src/utils/supabase/server";
import {UserRole} from "@/src/app/models/user-role";
import WrongUserRole from "@/src/app/utils/wrong-user-role";
import styles from './page.module.css';

export default async function Settings() {
    const supabase = await createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    return (
        <>
            {user?.role === UserRole.Trader ? (
                <>
                    <Typography variant={"h1"}>
                        Einstellungen
                    </Typography>

                    <Box className={styles.buttons_container}>
                        <Button variant={"outlined"}
                                href={"settings/category"}
                        >
                            Kategorien
                        </Button>

                        <Button variant={"outlined"}
                                href={"settings/user"}
                        >
                            Benutzer
                        </Button>
                        <Button variant={"outlined"}
                                href={"settings/strip"}
                        >
                            Leisten
                        </Button>
                        <Button variant={"outlined"}
                                href={"settings/palette"}
                        >
                            Paletten
                        </Button>
                    </Box>
                </>
            ) : (
                <WrongUserRole/>
            )}
        </>
    )
}