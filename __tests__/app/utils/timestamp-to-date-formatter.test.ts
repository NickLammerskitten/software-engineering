import { timestampToDate } from "@/src/app/utils/timestamp-to-date-formatter";
import { expect, test } from "vitest";

test('converting timestamp string to german formatted date', async () => {
    const timestamp = '2022-02-01T00:00:00.000Z';

    const date = timestampToDate(timestamp);

    expect(date).toBe('1.2.2022');
});

test('converting wrong formatted string results in error', async () => {
    const timestamp = 'test';

    const date = timestampToDate(timestamp);

    expect(date).toBe('Invalid Date');
});