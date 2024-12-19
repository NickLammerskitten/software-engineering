import Gallery from "@/src/app/(pages)/gallery/page";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe('Profile Page for trader', () => {
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

    test('Galerie Page', async () => {
        const Result = await Gallery();
        render(Result);

        expect(screen.getByText('Galerie')).toBeDefined();
        expect(screen.getByRole('heading')).toBeDefined();

        expect(screen.getByText('Bild hinzufügen')).toBeDefined();
        expect(screen.getByRole('link')).toBeDefined();
    })
});