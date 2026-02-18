import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { isRamadan } from '../utils/hijriUtils';

interface DhikrEntry {
    arabic: string;
    transliteration: string;
    meaning: string;
    count?: string;
    context: string;
}

const WEEKLY_DHIKR: DhikrEntry[] = [
    {
        arabic: 'سُبْحَانَ اللَّهِ',
        transliteration: 'SubhanAllah',
        meaning: 'Glory be to Allah',
        count: '33×',
        context: 'The Prophet ﷺ said: "Whoever says SubhanAllah 33 times after each prayer, Allah will forgive his sins even if they are as much as the foam of the sea." (Muslim)',
    },
    {
        arabic: 'الْحَمْدُ لِلَّهِ',
        transliteration: 'Alhamdulillah',
        meaning: 'All praise is for Allah',
        count: '33×',
        context: '"Alhamdulillah fills the scales." (Muslim) It is the most beloved of words to Allah and a constant reminder of gratitude.',
    },
    {
        arabic: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        meaning: 'Allah is the Greatest',
        count: '34×',
        context: 'Together with SubhanAllah and Alhamdulillah, these three form the tasbih of Fatimah — a gift from the Prophet ﷺ worth more than the world.',
    },
    {
        arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
        transliteration: 'La ilaha illallah',
        meaning: 'There is no god but Allah',
        context: 'The best of dhikr. The Prophet ﷺ said: "The best thing I and the prophets before me have said is: La ilaha illallah, alone, with no partner." (Tirmidhi)',
    },
    {
        arabic: 'أَسْتَغْفِرُ اللَّهَ',
        transliteration: 'Astaghfirullah',
        meaning: 'I seek Allah\'s forgiveness',
        context: 'The Prophet ﷺ sought forgiveness more than 70 times a day. Istighfar opens doors of provision, relieves distress, and purifies the heart.',
    },
    {
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
        transliteration: 'Allahumma salli ala Muhammad',
        meaning: 'Salawat upon the Prophet ﷺ',
        context: 'Friday is the best day to send salawat. "Whoever sends one salawat upon me, Allah sends ten upon him." (Muslim) It is especially virtuous on this blessed day.',
    },
    {
        arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
        transliteration: 'Hasbunallahu wa ni\'mal wakeel',
        meaning: 'Allah is sufficient for us, and He is the best Disposer of affairs',
        context: 'The words of Ibrahim ﷺ when cast into the fire, and of the Prophet ﷺ when warned of a great army. A dhikr of complete trust in Allah.',
    },
];

export const DhikrCard = () => {
    const [expanded, setExpanded] = useState(false);
    const { settings } = useSettings();

    const inRamadan = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && isRamadan());

    const accentColor = inRamadan ? 'var(--ramadan)' : 'var(--accent)';
    const accentBg = inRamadan ? 'rgba(180,83,9,0.08)' : 'rgba(var(--accent-rgb, 52,211,153),0.08)';

    const dayIndex = new Date().getDay(); // 0 = Sunday
    const dhikr = WEEKLY_DHIKR[dayIndex];

    return (
        <div className="px-6 pb-2">
            <button
                onClick={() => setExpanded(v => !v)}
                className="w-full text-left relative overflow-hidden rounded-2xl transition-all duration-200"
                aria-expanded={expanded}
            >
                {/* Card background */}
                <div
                    className="absolute inset-0 rounded-2xl border"
                    style={{
                        background: 'var(--card)',
                        borderColor: 'var(--border-card)',
                        boxShadow: 'var(--shadow)',
                    }}
                />

                <div className="relative px-5 py-4">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-3">
                        <span
                            className="text-[10px] font-semibold uppercase tracking-widest"
                            style={{ color: accentColor }}
                        >
                            Dhikr of the Day
                        </span>
                        <div className="flex items-center gap-2">
                            {dhikr.count && (
                                <span
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                                    style={{ color: accentColor, background: accentBg }}
                                >
                                    {dhikr.count}
                                </span>
                            )}
                            {expanded
                                ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--text-dim)' }} />
                                : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-dim)' }} />
                            }
                        </div>
                    </div>

                    {/* Arabic */}
                    <p
                        className="text-right text-lg font-light mb-1 leading-relaxed"
                        style={{ color: 'var(--text)', fontFamily: 'serif', direction: 'rtl' }}
                    >
                        {dhikr.arabic}
                    </p>

                    {/* Transliteration */}
                    <p
                        className="font-semibold text-sm"
                        style={{ color: 'var(--text)' }}
                    >
                        {dhikr.transliteration}
                    </p>

                    {/* Meaning */}
                    <p
                        className="text-xs font-light mt-0.5"
                        style={{ color: 'var(--text-dim)' }}
                    >
                        {dhikr.meaning}
                    </p>

                    {/* Expandable context */}
                    <div
                        className="overflow-hidden transition-all duration-300"
                        style={{ maxHeight: expanded ? '120px' : '0px', opacity: expanded ? 1 : 0 }}
                    >
                        <p
                            className="text-xs font-light leading-relaxed mt-3 pt-3"
                            style={{
                                color: 'var(--text-dim)',
                                borderTop: '1px solid var(--border-card)',
                            }}
                        >
                            {dhikr.context}
                        </p>
                    </div>
                </div>
            </button>
        </div>
    );
};
