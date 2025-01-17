import { beforeAll, describe, expect, test, vi } from 'vitest';
import { DELETE } from '@/src/app/api/user/[id]/route';
import { NextRequest } from 'next/server';

describe('User [id] DELETE as unauthorized user', () => {
    let response: Response;
    let body: { [key: string]: unknown };

    beforeAll(() => {
        vi.mock('@/src/utils/supabase/server', () => ({
            createAdminClient: vi.fn().mockImplementation(() => ({})),
            IsTrader: vi.fn().mockResolvedValue(false),
        }));
    });

    beforeAll(async () => {
        const req = new NextRequest(new Request('https://www.example.com/api/user/123456'))
        response = await DELETE(req);
        body = await response.json();
    });

    test('When unauthorized user should return 401', () => {
        expect(response.status).toBe(401);
        expect(body).not.toHaveProperty('data');
    });
});
