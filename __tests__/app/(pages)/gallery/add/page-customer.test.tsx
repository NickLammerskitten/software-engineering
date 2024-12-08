import AddImage from "@/src/app/(pages)/gallery/add/page";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe('Add Image Page for non-trader', () => {
    beforeEach(() => {
        vi.mock('@/src/utils/supabase/server', () => ({
            createClient: vi.fn().mockResolvedValue({
                auth: {
                    getUser: vi.fn().mockResolvedValue({
                        data: { user: { role: 'authenticated' } },
                    }),
                },
            }),
        }));
    });

    test('Page with wrong user role', async () => {
        const Result = await AddImage();
        render(Result);

        expect(screen.getByText('Du hast nicht die erforderliche Rolle, um diesen Inhalt zu sehen.')).toBeDefined();
    })
});