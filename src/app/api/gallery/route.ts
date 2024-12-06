import { NextResponse } from "next/server";

interface imageData {
    category: string;
    title: string;
    description: string;
    imageHeight: number;
    imageWidth: number;
    paperHeight: number;
    paperWidth: number;
    price: number;
    annotations: string;
}

export async function POST(request: Request) {
    console.log(await request.json() as imageData);

    // TODO: Save to database

    return NextResponse.json({
        message: "Bild erfolgreich hinzugefügt",
    });
}