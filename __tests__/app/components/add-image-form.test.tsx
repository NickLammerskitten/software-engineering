import AddImageForm from "@/src/app/components/add-image-form";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test('renders', () => {
    render(<AddImageForm/>)

    expect(screen.getByText('Kategorie *')).toBeDefined();
    expect(screen.getByText('Titel *')).toBeDefined();
    expect(screen.getByText('Beschreibung')).toBeDefined();
    expect(screen.getByText('Bildhöhe')).toBeDefined();
    expect(screen.getByText('Bildbreite')).toBeDefined();
    expect(screen.getByText('Papierhöhe')).toBeDefined();
    expect(screen.getByText('Papierbreite')).toBeDefined();
    expect(screen.getByText('Preis *')).toBeDefined();
    expect(screen.getByText('Anmerkungen')).toBeDefined();
})