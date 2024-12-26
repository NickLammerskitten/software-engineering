import Categories from "@/src/app/(pages)/settings/category/page";
import { render, screen } from "@testing-library/react";
import { http } from "msw";
import { setupServer } from "msw/node";
import { NextResponse } from "next/server";
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

describe('Categories Page for trader', () => {
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

    test('Category Page', async () => {
        const Result = await Categories();
        render(Result);

        expect(screen.getByText('Kategorien verwalten')).toBeDefined();
        expect(screen.getByRole('heading')).toBeDefined();

        expect(screen.getByText('Kategorie hinzufügen')).toBeDefined();
        expect(screen.getByRole('link')).toBeDefined();
    })
});