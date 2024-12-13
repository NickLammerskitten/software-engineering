import Settings from "@/src/app/(pages)/settings/page";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe('Settings Page for customer', () => {
    beforeEach(() => {
        vi.mock('@/src/utils/supabase/server', () => ({
            createClient: vi.fn().mockImplementation(() => ({
                auth: {
                    getUser: vi.fn().mockResolvedValue({
                        data: { user: { role: 'authenticated' } },
                    }),
                },
            })),
        }));
    });

    test('Settings Page', async () => {
        const Result = await Settings();
        render(Result);

        expect(screen.getByText('Du hast nicht die erforderliche Rolle, um diesen Inhalt zu sehen.')).toBeDefined();
    })
});