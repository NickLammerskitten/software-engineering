import { createClient } from "@/src/utils/supabase/server";

export const getSignedUrl = async (imagePath: string): Promise<string> => {
    const supabaseClient = createClient();

    const { data } = supabaseClient
        .storage
        .from('images')
        .getPublicUrl(imagePath);

    return data.publicUrl;
}