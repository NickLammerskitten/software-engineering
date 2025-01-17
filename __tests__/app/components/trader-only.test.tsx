import { TraderOnly } from "@/src/app/components/trader-only";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";

describe('Trader only component', () => {
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

    test('Show secret when authorized', async () => {
        const Result = await TraderOnly({children: "Secret"});

        expect(Result).toBeNull();
    });
});
