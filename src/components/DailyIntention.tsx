import { useSettings } from '../contexts/SettingsContext';
import { isRamadan } from '../utils/hijriUtils';
import { Heart } from 'lucide-react';

export const DailyIntention = () => {
    const { settings, data, updateData } = useSettings();

    const inRamadan = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && isRamadan());
    const accentColor = inRamadan ? '#C6A95E' : '#34D399';

    const handleChange = (value: string) => {
        updateData({ dailyIntention: value });
    };

    return (
        <div className="relative overflow-hidden mx-6 mb-6 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-app-card/40 to-app-card/20 rounded-3xl backdrop-blur-glass border border-white/10" />

            <div className="relative px-6 py-5">
                <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-4 h-4" style={{ color: accentColor }} strokeWidth={2} />
                    <label className="text-app-text text-sm font-semibold">
                        Today's Intention
                    </label>
                </div>

                <input
                    type="text"
                    value={data.dailyIntention}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="What is your spiritual focus today?"
                    className="w-full bg-transparent border-none outline-none text-app-text placeholder:text-app-text-dim/40 text-sm font-light"
                />
            </div>
        </div>
    );
};
