import AddImageForm from "@/src/app/components/add-image-form";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test('renders', () => {
    render(<AddImageForm/>)

    expect(screen.getByText('Kategorie')).toBeDefined();
    expect(screen.getByText('Titel')).toBeDefined();
    expect(screen.getByText('Beschreibung')).toBeDefined();
    expect(screen.getByText('Bildhöhe (in cm)')).toBeDefined();
    expect(screen.getByText('Bildbreite (in cm)')).toBeDefined();
    expect(screen.getByText('Papierhöhe (in cm)')).toBeDefined();
    expect(screen.getByText('Papierbreite (in cm)')).toBeDefined();
    expect(screen.getByText('Preis (in €)')).toBeDefined();
    expect(screen.getByText('Anmerkungen')).toBeDefined();
})