// Auth service – localStorage-based now, Supabase-ready later.
// To migrate: replace registerUser / loginUser bodies with supabase.auth calls.

export interface QamarUser {
    id: string;
    email: string;
    createdAt: string;
}

const USER_KEY = 'qamar_user';

function generateId(): string {
    return crypto.randomUUID();
}

// ─── Register ────────────────────────────────────────────────────────────────

export async function registerUser(email: string, password: string): Promise<QamarUser> {
    // TODO: replace with supabase.auth.signUp({ email, password })
    const existing = getStoredUser();
    if (existing && existing.email === email) {
        throw new Error('An account with this email already exists.');
    }

    // Store a minimal credential record (NOT for production – Supabase will handle real auth)
    const user: QamarUser = {
        id: generateId(),
        email,
        createdAt: new Date().toISOString(),
    };

    // Store hashed-ish credential (base64 only – this is a placeholder, not real security)
    const credential = { email, passwordB64: btoa(password), userId: user.id };
    localStorage.setItem('qamar_credentials', JSON.stringify(credential));
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return user;
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string): Promise<QamarUser> {
    // TODO: replace with supabase.auth.signInWithPassword({ email, password })
    const credRaw = localStorage.getItem('qamar_credentials');
    if (!credRaw) throw new Error('No account found. Please register first.');

    const cred = JSON.parse(credRaw) as { email: string; passwordB64: string; userId: string };

    if (cred.email !== email || cred.passwordB64 !== btoa(password)) {
        throw new Error('Invalid email or password.');
    }

    const user: QamarUser = {
        id: cred.userId,
        email: cred.email,
        createdAt: new Date().toISOString(),
    };

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export function logoutUser(): void {
    // TODO: replace with supabase.auth.signOut()
    localStorage.removeItem(USER_KEY);
}

// ─── Session restore ─────────────────────────────────────────────────────────

export function getStoredUser(): QamarUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as QamarUser;
    } catch {
        return null;
    }
}
