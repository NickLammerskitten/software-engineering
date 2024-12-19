import Users from "@/src/app/(pages)/settings/user/page";
import { User } from "@supabase/auth-js";
import { render, screen } from "@testing-library/react";
import { http } from "msw";
import { setupServer } from "msw/node";
import { NextResponse } from "next/server";
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

describe('User Page for trader', () => {
    const users: User[] = []

    const restHandlers = [
        http.get('api/user', () => {
            return NextResponse.json({ data: users })
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

    test('User Page', async () => {
        const Result = await Users();
        render(Result);

        expect(screen.getByText('Benutzer')).toBeDefined();
        expect(screen.getByRole('heading')).toBeDefined();
    })
});