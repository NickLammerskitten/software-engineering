'use server'

import { createClient } from '@/src/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(email: string, password: string) {
    const supabase = createClient()

    const loginCredentials = {
        email: email,
        password: password,
    }

    const { error } = await supabase.auth.signInWithPassword(loginCredentials)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function logout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    revalidatePath('/login', 'layout')
    redirect('/login')
}