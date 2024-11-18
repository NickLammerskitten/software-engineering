import { expect, test } from "vitest";
import { render, screen } from '@testing-library/react'
import Page from "@/src/app/error/page";

test('Error Page', () => {
    render(<Page/>);
    expect(screen.getByText('Sorry, something went wrong')).toBeDefined();
})