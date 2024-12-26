import AddImage from "@/src/app/(pages)/image/add/page";
import { render, screen } from "@testing-library/react";
import { http } from "msw";
import { setupServer } from "msw/node";
import { NextResponse } from "next/server";
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

describe('Add Image Page for trader', () => {
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

    test('renders form for authenticated trader', async () => {
        const result = await AddImage();
        render(result);

        expect(screen.getByText('Bild hinzufügen')).toBeDefined();
    });
});

