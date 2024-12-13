import Categories from "@/src/app/(pages)/settings/category/page";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe('Categories Page for trader', () => {
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

    test('Category Page', async () => {
        const Result = await Categories();
        render(Result);

        expect(screen.getByText('Kategorien verwalten')).toBeDefined();
        expect(screen.getByRole('heading')).toBeDefined();

        expect(screen.getByText('Kategorie hinzufügen')).toBeDefined();
        expect(screen.getByRole('link')).toBeDefined();
    })
});