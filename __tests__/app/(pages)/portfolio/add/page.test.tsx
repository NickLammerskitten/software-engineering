import AddPortfolio from "@/src/app/(pages)/portfolio/add/page";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe('Add Portfolio page', () => {
    test('should render add portfolio page', async () => {
        const Result = await AddPortfolio();
        render(Result);

        expect(screen.getByText("Themenmappe hinzufügen")).toBeDefined();
        expect(screen.getByText("Name *")).toBeDefined();
        expect(screen.getByText("Beschreibung")).toBeDefined();

        expect(screen.getByText("Speichern")).toBeDefined();
        expect(screen.getByText("Abbrechen")).toBeDefined();
    });
});