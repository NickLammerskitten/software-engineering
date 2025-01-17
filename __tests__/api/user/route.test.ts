import { beforeAll, describe, expect, test, vi } from 'vitest';
import { GET } from '@/src/app/api/user/route';

describe('User GET as unauthorized user', () => {
    let response: Response;
    let body: { [key: string]: unknown };

    beforeAll(() => {
        vi.mock('@/src/utils/supabase/server', () => ({
            createAdminClient: vi.fn().mockImplementation(() => ({})),
            IsTrader: vi.fn().mockResolvedValue(false),
        }));
    });

    beforeAll(async () => {
        response = await GET();
        body = await response.json();
    });

    test('When unauthorized user should return 401', () => {
        expect(response.status).toBe(401);
        expect(body).not.toHaveProperty('data');
    });
});
