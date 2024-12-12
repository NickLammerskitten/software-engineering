import AddImage from "@/src/app/(pages)/gallery/add/page";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe('Add Image Page for trader', () => {
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

    test('renders form for authenticated trader', async () => {
        const result = await AddImage();
        render(result);

        expect(screen.getByText('Bild hinzufügen')).toBeDefined();
    });
});

