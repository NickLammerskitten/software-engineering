import Settings from "@/src/app/(pages)/settings/page";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe('Settings Page for trader', () => {
    beforeEach(() => {
        vi.mock('@/src/utils/supabase/server', () => ({
            createClient: vi.fn().mockImplementation(() => ({
                auth: {
                    getUser: vi.fn().mockResolvedValue({
                        data: { user: { role: 'trader' } }
                    }),
                },
            })),
        }));
    });

    test('Settings Page', async () => {
        const Result = await Settings();
        render(Result);

        expect(screen.getByText('Einstellungen')).toBeDefined();
        expect(screen.getByRole('heading')).toBeDefined();

        expect(screen.getByText('Kategorien')).toBeDefined();
        expect(screen.getByRole('link')).toBeDefined();
    })
});