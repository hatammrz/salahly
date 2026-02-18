import { supabase } from '../lib/supabase'

export async function registerUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) throw error
    return data
}

export async function loginUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) throw error
    return data
}

export async function logoutUser() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export async function getCurrentUser() {
    const { data } = await supabase.auth.getUser()
    return data.user
}