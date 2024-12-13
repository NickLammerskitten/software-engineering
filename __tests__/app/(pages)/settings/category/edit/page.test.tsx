import EditCategory from "@/src/app/(pages)/settings/category/edit/page";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe('Add category Page for trader', () => {
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

    test('Add category Page', async () => {
        const Result = await EditCategory();
        render(Result);

        expect(screen.getByText('Kategorie bearbeiten')).toBeDefined();
        expect(screen.getByRole('heading')).toBeDefined();
    })
});