import EditCategory from "@/src/app/(pages)/settings/category/edit/page";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe('Edit category Page for customers', () => {
    beforeEach(() => {
        vi.mock('@/src/utils/supabase/server', () => ({
            createClient: vi.fn().mockImplementation(() => ({
                auth: {
                    getUser: vi.fn().mockResolvedValue({
                        data: { user: { role: 'authenticated' } }
                    }),
                },
            })),
        }));
    });

    test('Edit category Page', async () => {
        const Result = await EditCategory();
        render(Result);

        expect(screen.getByText('Du hast nicht die erforderliche Rolle, um diesen Inhalt zu sehen.')).toBeDefined();
    })
});