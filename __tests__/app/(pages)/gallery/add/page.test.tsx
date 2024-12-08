import Page from "@/src/app/(pages)/gallery/add/page";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe('Add Image Page for trader', () => {
    beforeEach(() => {
        vi.mock('@/src/utils/supabase/server', () => ({
            createClient: vi.fn().mockResolvedValue({
                auth: {
                    getUser: vi.fn().mockResolvedValue({
                        data: { user: { role: 'trader' } },
                    }),
                },
            }),
        }));
    });

    test('Add Image Page', async () => {
        const Result = await Page();
        render(Result);

        expect(screen.getByText('Bild hinzufügen')).toBeDefined();
    })

    test('Page with wrong user role', async () => {
        vi.mock('@/src/utils/supabase/server', () => ({
            createClient: vi.fn().mockResolvedValue({
                auth: {
                    getUser: vi.fn().mockResolvedValue({
                        data: { user: { role: 'authenticated' } },
                    }),
                },
            }),
        }));

        const Result = await Page();
        render(Result);

        expect(screen.getByText('Du hast nicht die erforderliche Rolle, um diesen Inhalt zu sehen.')).toBeDefined();
    })
});

