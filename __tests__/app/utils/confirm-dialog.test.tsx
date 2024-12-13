import ConfirmDialog from "@/src/app/utils/confirm-dialog";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

describe('confirm dialog', () => {
    const mockOnConfirm = vi.fn(); // Mock für die Bestätigungsfunktion

    afterEach(() => {
        mockOnConfirm.mockClear();
        cleanup();
    })

    test('confirm dialog submit', () => {
        render(<ConfirmDialog onConfirm={() => {
            mockOnConfirm();
            return Promise.resolve();
        }}/>);

        const openButton = screen.getByRole("button");
        expect(openButton).toBeDefined()

        fireEvent.click(openButton);

        expect(screen.getByText('Möchtest du diese Aktion wirklich ausführen?')).toBeDefined();
        expect(screen.getByText('Abbrechen')).toBeDefined();
        expect(screen.getByText('Bestätigen')).toBeDefined();

        // Klick auf den Bestätigen-Button simulieren
        const confirmButton = screen.getByText("Bestätigen");
        fireEvent.click(confirmButton);

        // Prüfen, ob die `onConfirm`-Funktion aufgerufen wurde
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    })

    test('confirm dialog cancel', () => {

        render(<ConfirmDialog onConfirm={() => {
            mockOnConfirm();
            return Promise.resolve();
        }}/>);

        const openButton = screen.getByRole("button");
        expect(openButton).toBeDefined()

        fireEvent.click(openButton);

        expect(screen.getByText('Möchtest du diese Aktion wirklich ausführen?')).toBeDefined();
        expect(screen.getByText('Abbrechen')).toBeDefined();
        expect(screen.getByText('Bestätigen')).toBeDefined();

        // Klick auf den Abbrechen-Button simulieren
        const cancelButton = screen.getByText("Abbrechen");
        fireEvent.click(cancelButton);

        // Prüfen, ob die `onConfirm`-Funktion aufgerufen wurde
        expect(mockOnConfirm).toHaveBeenCalledTimes(0);
    })
});
