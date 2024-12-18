import { createClient } from "@/src/utils/supabase/server";
import { decode } from 'base64-arraybuffer'
import { NextResponse } from "next/server";

interface fileData {
    title: string;
    data: string;
    contentType: string;
}

interface fileStorageData {
    title: string;
    data: ArrayBuffer;
    contentType: string;
}

/*
    This file is the route for the gallery/file API. It is for uploading images to the gallery.
    Returns a message and a path if successful or if already exists
    Returns an error message if not successful
 */
export async function POST(request: Request) {
    const supabaseClient = await createClient()

    const requestData = (await request.json()).file as fileData;

    const parsedData = parseData(requestData);
    const { valid, errors } = validateData(parsedData);
    if (!valid) {
        return NextResponse.json({message: errors.join("\n")}, {
            status: 400,
        });
    }

    const { data, error } = await supabaseClient
        .storage
        .from('images')
        .upload(`public/images/${parsedData.title}`, parsedData.data, {
            contentType: parsedData.contentType,
        })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (error && error.statusCode !== '409') {
        return NextResponse.json({message: "Fehler beim Hinzufügen des Bildes"}, {
            status: 500,
        });
    }

    return NextResponse.json({
        message: "Bild erfolgreich hinzugefügt",
        path: data?.path ?? 'public/images/' + parsedData.title,
    });
}

const validateData = (data: fileStorageData) => {
    const errors: string[] = [];

    if (!data.title) {
        errors.push("Title is required");
    }

    if (!data.data) {
        errors.push("Data is required");
    }

    if (!data.contentType && data.contentType !== "image/jpeg" && data.contentType !== "image/png") {
        errors.push("Content type is required and must be image/jpeg or image/png");
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

const parseData = (data: fileData): fileStorageData => {
    return {
        title: data.title.trim(),
        data: decode(data.data),
        contentType: data.contentType,
    }
}
