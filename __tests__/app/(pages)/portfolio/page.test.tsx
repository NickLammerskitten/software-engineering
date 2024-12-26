import PortfolioPage from "@/src/app/(pages)/portfolio/page";
import { TraderOnlyProps } from "@/src/app/components/trader-only";
import { Portfolio } from "@/src/app/models/portfolio.model";
import { render, screen } from "@testing-library/react";
import { http } from "msw";
import { setupServer } from "msw/node";
import { NextResponse } from "next/server";
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

describe('Portfolio page for trader', () => {
    const portfolios: Portfolio[] = [
        { id: '1', name: 'Portfolio 1', description: 'Portfolio 1 description', owner_id: '342423' },
    ];

    const restHandlers = [
        http.get("api/portfolio/my", () => {
            return NextResponse.json({ data: portfolios });
        }),
    ];

    const server = setupServer(...restHandlers);

    beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

    beforeEach(() => {
        vi.mock('@/src/utils/supabase/server', () => ({
            createClient: vi.fn().mockImplementation(() => ({
                auth: {
                    getUser: vi.fn().mockResolvedValue({
                        data: { user: { role: 'trader' } },
                    }),
                },
            })),
        }));

        vi.mock("@/src/app/components/trader-only", () => ({
            TraderOnly: ({ children }: TraderOnlyProps) => {
                return <>{children}</>
            },
        }));
    });

    afterAll(() => server.close());

    test('should render trader portfolio page', async () => {
        const Result = await PortfolioPage();
        render(Result);

        await vi.waitFor(() => {
            expect(screen.getByText("Themenmappen")).toBeDefined();

            expect(screen.getByText("Hinzufügen")).toBeDefined();
        });
    });
});