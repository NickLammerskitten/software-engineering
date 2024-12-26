import Profile from "@/src/app/(pages)/profile/page";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe('Settings Page for trader', () => {
    beforeEach(() => {
        vi.mock('@/src/utils/supabase/server', () => ({
            createClient: vi.fn().mockImplementation(() => ({
                auth: {
                    getUser: vi.fn().mockResolvedValue({
                        data: {
                            user:
                                {
                                    id: '185f2f83-d63a-4c9b-b4a0-7e4a885799e2',
                                    role: 'trader',
                                    created_at: '2022-01-01T00:00:00.000000Z',
                                    updated_at: '2022-01-01T00:00:00.000000Z',
                                    email: 'trader@email.com',
                                },
                        },
                    }),
                },
            })),
        }));
    });

    test('Profile Page', async () => {
        const Result = await Profile();
        render(Result);

        expect(screen.getByText('Profil')).toBeDefined();
        expect(screen.getByRole('heading')).toBeDefined();

        expect(screen.findByText('E-Mail:')).toBeDefined();
        expect(screen.findByText('trader@email.com')).toBeDefined();

        expect(screen.findByText('Rolle')).toBeDefined();
        expect(screen.findByText('Händler')).toBeDefined();

        expect(screen.findByText('Erstellt am')).toBeDefined();
        expect(screen.findByText('01.01.2022')).toBeDefined();

        expect(screen.findByText('Aktualisiert am')).toBeDefined();
        expect(screen.findByText('01.01.2022')).toBeDefined();

        expect(screen.findByText('ID')).toBeDefined();
        expect(screen.findByText('185f2f83-d63a-4c9b-b4a0-7e4a885799e2')).toBeDefined();
    })
});