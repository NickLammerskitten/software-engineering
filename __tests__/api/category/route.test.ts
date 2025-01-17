import { beforeAll, beforeEach, describe, expect, expectTypeOf, test, vi } from 'vitest';
import { GET } from '@/src/app/api/category/route';

describe('Category routes', () => {
    let response: Response;
    let body: {[key: string]: unknown};

    beforeEach(() => {
        vi.mock('@/src/utils/supabase/server', () => ({
            createClient: vi.fn().mockImplementation(() => ({
                from: vi.fn().mockImplementation(() => ({
                    select: vi.fn().mockImplementation(() => ({
                        order: vi.fn().mockResolvedValue({
                            data: ["test", "test2"]
                        })
                    }))
                })),
            })),
        }));
    });

    beforeAll(async () => {
        response = await GET();
        body = await response.json();
    });

    test('Should have status 200', () => {
        expect(response.status).toBe(200);
    });

    test('Should have content-type', () => {
        expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    test('Should have array in the body', () => {
        expectTypeOf(body).toHaveProperty("data");
    });
});
