'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

function mapAuthError(error: any) {
    const msg = error?.message || '';
    if (msg.includes('Invalid login credentials')) return 'Email atau password salah';
    if (msg.includes('User already registered')) return 'Email sudah terdaftar';
    if (msg.includes('Password should be at least')) return 'Password minimal 6 karakter';
    return msg || 'Terjadi kesalahan';
}

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email dan password harus diisi' }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: mapAuthError(error) }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    if (!email || !password || !name) {
        return { error: 'Semua kolom harus diisi' }
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: name
            }
        }
    })

    if (error) {
        return { error: mapAuthError(error) }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/auth')
}
