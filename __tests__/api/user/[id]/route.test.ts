import { beforeAll, describe, expect, test, vi } from 'vitest';
import { DELETE } from '@/src/app/api/user/[id]/route';
import { NextRequest } from 'next/server';
import { User } from '@supabase/supabase-js';

describe('User [id] DELETE as authorized user', () => {
    let response: Response;
    let body: { [key: string]: unknown };

    beforeAll(() => {
        vi.mock('@/src/utils/supabase/server', () => ({
            createAdminClient: vi.fn().mockImplementation(() => ({
                auth: {
                    admin: {
                        deleteUser: vi.fn().mockResolvedValue({
                            data: {
                                user: {id: "123456"},
                            },
                        }),
                    },
                },
            })),
            IsTrader: vi.fn().mockResolvedValue(true),
        }));
    });

    beforeAll(async () => {
        const req = new NextRequest(new Request('https://www.example.com/api/user/123456'))
        response = await DELETE(req);
        body = await response.json();
    });

    test('When authorized user should return 200', () => {
        expect(response.status).toBe(200);
    });

    test('Body should contain user', () => {
        expect(body).toHaveProperty('data');
        expect((body.data as User).id).toBe("123456");
    });
});
