import Page from "@/src/app/(pages)/gallery/page";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test('Discover Page', () => {
    render(<Page/>);
    expect(screen.getByText('Discover page')).toBeDefined();
    expect(screen.getByRole('heading')).toBeDefined();

    expect(screen.getByText('Bild hinzufügen')).toBeDefined();
    expect(screen.getByRole('link')).toBeDefined();
})