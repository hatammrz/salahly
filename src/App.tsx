import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useSettings } from './contexts/SettingsContext';
import { isRamadan } from './utils/hijriUtils';
import { HomeScreen } from './components/HomeScreen';
import { QiblaScreen } from './components/QiblaScreen';
import { FastingJournal } from './components/FastingJournal';
import { SettingsScreen } from './components/SettingsScreen';
import { AccountScreen } from './components/AccountScreen';
import { DonationsScreen } from './components/DonationsScreen';
import { BottomNav } from './components/BottomNav';

type Tab = 'home' | 'qibla' | 'fasting' | 'settings' | 'account' | 'donate';

function App() {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const { settings } = useSettings();
    const { loading } = useAuth();

    const inRamadanMode = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && isRamadan());

    const bgStyle = inRamadanMode
        ? { backgroundColor: '#050505' }
        : settings.backgroundMode === 'oled'
            ? { backgroundColor: '#000000' }
            : {};

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex flex-col transition-colors duration-200"
            style={{ background: bgStyle.backgroundColor ?? 'var(--bg)', color: 'var(--text)' }}
        >
            <main className="flex-1 overflow-hidden">
                {activeTab === 'home' && <HomeScreen />}
                {activeTab === 'qibla' && <QiblaScreen />}
                {activeTab === 'fasting' && <FastingJournal />}
                {activeTab === 'settings' && <SettingsScreen />}
                {activeTab === 'account' && (
                    <AccountScreen onNavigateToDonate={() => setActiveTab('donate')} />
                )}
                {activeTab === 'donate' && <DonationsScreen />}
            </main>

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}

export default App;
