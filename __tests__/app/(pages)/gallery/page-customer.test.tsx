import GalleryPage from "@/src/app/(pages)/gallery/page";
import { render, screen } from "@testing-library/react";
import { NextResponse } from "next/server";
import { http } from "msw";
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { ImageResponseData } from "@/src/app/api/models/image.model";
import { setupServer } from "msw/node";

describe('Gallery Page for customer', () => {
    const images: ImageResponseData[] = [
        {
            "id": "e05c6c97-c950-40e9-bb9a-ac4262025d4e",
            "categoryId": 1,
            "title": "Image 1",
            "artist": "Künstler 1",
            "description": "Image 1 description",
            "imageHeight": 1000,
            "imageWidth": 1000,
            "paperHeight": 1000,
            "paperWidth": 1000,
            "price": 100,
            "annotations": "Annotation",
            "image_url": null
        },
        {
            "id": "5d6530c1-9083-4c20-bb3e-b959a264ef91",
            "categoryId": 2,
            "title": "Image 2",
            "artist": "Künstler 2",
            "description": "Image 2 description",
            "imageHeight": 100,
            "imageWidth": 100,
            "paperHeight": 120,
            "paperWidth": 120,
            "price": 999.95,
            "annotations": "Annotation 2",
            "image_url": null
        },
        {
            "id": "ee231262-033e-4826-a5c6-cf37c43653f9",
            "categoryId": 1,
            "title": "test",
            "artist": "picasso",
            "description": "my test description",
            "imageHeight": null,
            "imageWidth": null,
            "paperHeight": null,
            "paperWidth": null,
            "price": 45,
            "annotations": "",
            "image_url": null
        },
    ];

    const categories: Category[] = [
        {
            id: 1,
            name: 'Original',
        },
        {
            id: 2,
            name: 'Kopie',
        },
    ]

    const restHandlers = [
        http.get("api/image", () => {
            return NextResponse.json({ data: images, page: 0, pageSize: 10, total: 3 });
        }),
        http.get('api/category', () => {
            return NextResponse.json({ data: categories })
        }),
    ];

    const server = setupServer(...restHandlers);

    beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

    beforeEach(() => {
        vi.mock('@/src/utils/supabase/client', () => ({
            createClient: vi.fn().mockImplementation(() => ({
                auth: {
                    getUser: vi.fn().mockResolvedValue({
                        data: { user: { role: 'authenticated' } }
                    }),
                },
            })),
        }));

        vi.mock("next/navigation", () => ({
            useRouter() {
                return {
                    prefetch: () => null
                };
            },
            useSearchParams: vi.fn().mockReturnValue({
                get: vi.fn(),
            }),
            usePathname: vi.fn(),
        }));

        vi.mock("@/src/app/components/trader-only", () => ({
            TraderOnly: () => {return null;}
        }));
    });

    afterAll(() => server.close());

    test('Galerie Page', async () => {
        render(<GalleryPage />);

        await vi.waitFor(() => {
            if (!screen.getByText("Image 1")) {
                throw new Error("Images weren't loaded");
            }
        }, {timeout: 10000, interval: 100});

        expect(screen.getByText('Galerie')).toBeDefined();
        expect(screen.getByRole('heading')).toBeDefined();

        expect(screen.getByText('Image 1')).toBeDefined();
        expect(screen.getByText('Künstler 1')).toBeDefined();

        expect(screen.queryByText('Bild hinzufügen')).toBeNull();
        expect(screen.queryByRole('link')).toBeNull();
    })
});
