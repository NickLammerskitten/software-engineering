import EditImageForm from "@/src/app/components/edit-image-form";
import { render, screen } from "@testing-library/react";
import { http } from "msw";
import { setupServer } from "msw/node";
import { NextResponse } from "next/server";
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

describe('add image form', () => {
    const categories: Category[] = [
        {
            id: 1,
            name: 'Original',
        },
        {
            id: 2,
            name: 'Reproduktion',
        },
    ]

    const restHandlers = [
        http.get('api/category', () => {
            return NextResponse.json({ data: categories })
        }),
    ]

    const server = setupServer(...restHandlers)

    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

    beforeEach(() => {
        vi.mock('@/src/utils/supabase/server', () => ({
            createClient: vi.fn().mockImplementation(() => ({
                auth: {
                    getUser: vi.fn().mockResolvedValue({
                        data: { user: { role: 'trader' } },
                    }),
                },
            })),
        }));
    });

    afterAll(() => server.close())

    test('renders', () => {
        render(<EditImageForm/>)

        expect(screen.getByText('Kategorie *')).toBeDefined();
        expect(screen.getByText('Titel *')).toBeDefined();
        expect(screen.getByText('Künstler *')).toBeDefined();
        expect(screen.getByText('Beschreibung')).toBeDefined();
        expect(screen.getByText('Motivhöhe')).toBeDefined();
        expect(screen.getByText('Motivbreite')).toBeDefined();
        expect(screen.getByText('Papierhöhe')).toBeDefined();
        expect(screen.getByText('Papierbreite')).toBeDefined();
        expect(screen.getByText('Preis *')).toBeDefined();
        expect(screen.getByText('Bild *')).toBeDefined();
        expect(screen.getByText('Anmerkungen')).toBeDefined();
    })
})
