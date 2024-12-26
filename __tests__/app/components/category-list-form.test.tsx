import { CategoryList } from "@/src/app/components/category-list";
import { render, screen } from "@testing-library/react";
import { http } from "msw";
import { setupServer } from 'msw/node'
import { NextResponse } from "next/server";
import { expect, test, afterAll, beforeAll, beforeEach, describe, vi } from "vitest";

// Read is for every user role allowed. Delete for trader, but this is secured by RLS.
describe('Display categories for trader', () => {
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

    test('Category Page', () => {
        render(<CategoryList/>)

        expect(screen.findByText('Original')).toBeDefined();
        expect(screen.findByText('Reproduktion')).toBeDefined();
    });
})