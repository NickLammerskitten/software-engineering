import DetailPage from "@/src/app/(pages)/image/[id]/page";
import { Image } from "@/src/app/models/image.model";
import { render, screen } from "@testing-library/react";
import { http } from "msw";
import { setupServer } from "msw/node";
import { NextResponse } from "next/server";
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

describe('Image Detail Page', () => {
    const image: Image =
        {
            id: 'c4f84ede-27cf-482e-afac-ad872d027de1',
            categoryId: 1,
            title: 'Test Titel',
            description: 'Test Beschreibung',
            imageHeight: 1,
            imageWidth: 1,
            paperHeight: 1,
            paperWidth: 1,
            annotations: 'Test Anmerkung',
            price: 1.99,
            artist: 'Test Künstler',
            imagePath: null,
        };

    const category: Category =
        {
            id: 1,
            name: 'Original',
        }

    const restHandlers = [
        http.get('api/image/c4f84ede-27cf-482e-afac-ad872d027de1', () => {
            return NextResponse.json({ data: image })
        }),

        http.get('api/category/1', () => {
            return NextResponse.json({ data: category })
        }),
    ]

    const server = setupServer(...restHandlers)

    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

    beforeEach(() => {
        vi.mock("next/navigation", () => ({
            usePathname: vi.fn().mockReturnValue('/image/c4f84ede-27cf-482e-afac-ad872d027de1'),
        }));
    });

    afterAll(() => server.close())

    test('Image Detail Page', async () => {
        const Result = await DetailPage();
        render(Result);

        expect(screen.findByText('Test Titel')).toBeDefined();
        expect(screen.findByRole('heading')).toBeDefined();

        expect(screen.findByText('Künstler: Test Künstler')).toBeDefined();
        expect(screen.findByText('1,99 €')).toBeDefined();

        expect(screen.findByText('Kategorie: Original')).toBeDefined();
        expect(screen.findByText('Test Beschreibung')).toBeDefined();
        expect(screen.findByText('Anmerkung: Test Anmerkung')).toBeDefined();
        expect(screen.findByText('Kennung: c4f84ede-27cf-482e-afac-ad872d027de1')).toBeDefined();

        expect(screen.findByText('Höhe: 1 cm')).toBeDefined();
        expect(screen.findByText('Breite: 1 cm')).toBeDefined();
        expect(screen.findByText('Papierhöhe: 1 cm')).toBeDefined();
        expect(screen.findByText('Papierbreite: 1 cm')).toBeDefined();
    })
});