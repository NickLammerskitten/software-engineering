import { EditCategoryForm } from "@/src/app/components/edit-category-form";
import { render, screen } from "@testing-library/react";
import { http } from "msw";
import { setupServer } from "msw/node";
import { NextResponse } from "next/server";
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

describe('edit category form', () => {
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
        http.get('api/category/1', () => {
            return NextResponse.json({ data: categories[0] })
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

        vi.mock("next/navigation", () => ({
            useSearchParams: vi.fn().mockReturnValue({
                get: vi.fn().mockReturnValue(1),
            }),
        }));
    });

    afterAll(() => server.close())

    test('renders', () => {
        render(<EditCategoryForm />)

        expect(screen.findByText('Name *')).toBeDefined();
    });
})
