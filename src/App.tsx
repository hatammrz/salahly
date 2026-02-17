import { useState } from 'react';
import { useSettings } from './contexts/SettingsContext';
import { isRamadan } from './utils/hijriUtils';
import { HomeScreen } from './components/HomeScreen';
import { QiblaScreen } from './components/QiblaScreen';
import { FastingJournal } from './components/FastingJournal';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNav } from './components/BottomNav';

function App() {
    const [activeTab, setActiveTab] = useState<'home' | 'qibla' | 'fasting' | 'settings'>('home');
    const { settings } = useSettings();

    // Determine if Ramadan mode is active
    const inRamadanMode = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && isRamadan());

    // Dynamic background and accent colors based on Ramadan mode
    const backgroundStyle = inRamadanMode
        ? 'bg-[#050505]' // Deep black for Ramadan
        : settings.backgroundMode === 'oled'
            ? 'bg-black'
            : settings.backgroundMode === 'animated'
                ? 'bg-gradient-to-br from-app-bg via-app-bg-light to-app-bg'
                : 'bg-gradient-to-br from-app-bg to-app-bg-light';

    return (
        <div className={`min-h-screen ${backgroundStyle} flex flex-col transition-colors duration-1000`}>
            <main className="flex-1 overflow-hidden">
                {activeTab === 'home' && <HomeScreen />}
                {activeTab === 'qibla' && <QiblaScreen />}
                {activeTab === 'fasting' && <FastingJournal />}
                {activeTab === 'settings' && <SettingsScreen />}
            </main>

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}

export default App;
