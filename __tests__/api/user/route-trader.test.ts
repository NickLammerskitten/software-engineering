import { beforeAll, describe, expect, test, vi } from 'vitest';
import { GET } from '@/src/app/api/user/route';

describe('User GET as authorized user', () => {
    let response: Response;
    let body: { [key: string]: unknown };

    beforeAll(() => {
        vi.mock('@/src/utils/supabase/server', () => ({
            createAdminClient: vi.fn().mockImplementation(() => ({
                from: vi.fn().mockImplementation(() => ({
                    select: vi.fn().mockImplementation(() => ({
                        order: vi.fn().mockResolvedValue({
                            data: ["test", "test2"]
                        })
                    }))
                    })),
                auth: {
                    admin: {
                        listUsers: vi.fn().mockResolvedValue({
                            data: {
                                users: ["user1", "user2"],
                            },
                        }),
                    },
                },
            })),
            IsTrader: vi.fn().mockResolvedValue(true),
        }));

    });

    beforeAll(async () => {
        response = await GET();
        body = await response.json();
    });

    test('When authorized user should return 200', () => {
        expect(response.status).toBe(200);
        expect(body).toHaveProperty('data');
    });

    test('Body should contain users', () => {
        expect(body).toHaveProperty('data');
        expect(body.data).toEqual(["user1", "user2"]);
    });
});
