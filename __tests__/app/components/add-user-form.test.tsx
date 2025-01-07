import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddUserForm from "@/src/app/components/add-user-form";
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { SnackbarProvider } from 'notistack';

describe('AddUserForm Component', () => {
    beforeEach(() => {
        // Mock für fetch API
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('renders the form with required fields', () => {
        render(
            <SnackbarProvider>
                <AddUserForm />
            </SnackbarProvider>
        );


        expect(screen.getByLabelText('Email *')).toBeDefined();
        expect(screen.getByLabelText('Password *')).toBeDefined();
        expect(screen.getByLabelText('Name')).toBeDefined();


        expect(screen.getByRole('link', { name: 'Abbrechen' })).toBeDefined();
        expect(screen.getByRole('button', { name: 'Speichern' })).toBeDefined();
    });

    test('submits form data and shows success message', async () => {
        const mockFetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Nutzer erfolgreich angelegt' }),
        });
        vi.stubGlobal('fetch', mockFetch);



        fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });


        fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));


        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('/api/user', {
                body: JSON.stringify({
                    formData: {
                        email: 'test@example.com',
                        password: 'password123',
                        role: 'authenticated',
                        user_metadata: { name: 'Test User' },
                    },
                }),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            expect(screen.getByText('Nutzer erfolgreich angelegt'));
        });
    });

    test('shows error message on failed submission', async () => {
        const mockFetch = vi.fn().mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Fehler beim Erstellen des Nutzers' }),
        });
        vi.stubGlobal('fetch', mockFetch);



        fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });


        fireEvent.click(screen.getByRole('button', { name: 'Speichern' }));


        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled();

            expect(screen.getByText('Fehler beim Erstellen des Nutzers'));
        });
    });
});
