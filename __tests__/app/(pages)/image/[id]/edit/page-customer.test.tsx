import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import EditImage from "@/src/app/(pages)/image/[id]/edit/page";

describe('Eidt Image Page for non-trader', () => {
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
        const Result = await EditImage();
        render(Result);

        expect(screen.getByText('Du hast nicht die erforderliche Rolle, um diesen Inhalt zu sehen.')).toBeDefined();
    })
});