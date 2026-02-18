import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { AuthProvider, useAuth } from './context/AuthContext.tsx'
import { SettingsProvider } from './contexts/SettingsContext.tsx'

// Bridge: reads userId from AuthContext, passes to SettingsProvider
function Providers({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    return (
        <SettingsProvider userId={user?.id ?? null}>
            {children}
        </SettingsProvider>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <Providers>
                    <App />
                </Providers>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
)
