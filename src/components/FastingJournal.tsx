import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Calendar, Check, X, Star, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { isRamadan } from '../utils/hijriUtils';

export const FastingJournal = () => {
    const { settings, data, addFastingDay, removeFastingDay } = useSettings();
    const { user } = useAuth();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const inRamadan = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && isRamadan());
    const accentColor = inRamadan ? 'var(--ramadan)' : 'var(--accent)';
    const accentColorDim = inRamadan ? 'var(--ramadan-dim)' : 'var(--accent-dim)';
    const accentHex = inRamadan ? '#B45309' : '#34D399';
    const accentDimHex = inRamadan ? '#92400E' : '#10B981';

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const currentMonthFasts = data.fastingDays.filter(fd => {
        const fdDate = new Date(fd.date);
        return isSameMonth(fdDate, currentMonth);
    });

    const fastedCount = currentMonthFasts.filter(f => f.status === 'fasted').length;
    const voluntaryCount = currentMonthFasts.filter(f => f.status === 'voluntary').length;
    const missedCount = currentMonthFasts.filter(f => f.status === 'missed').length;

    const handleDayClick = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const existing = data.fastingDays.find(fd => fd.date === dateStr);
        if (!existing) addFastingDay(dateStr, 'fasted');
        else if (existing.status === 'fasted') addFastingDay(dateStr, 'voluntary');
        else if (existing.status === 'voluntary') addFastingDay(dateStr, 'missed');
        else removeFastingDay(dateStr);
    };

    const getDayStatus = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return data.fastingDays.find(fd => fd.date === dateStr);
    };

    if (!user) {
        return (
            <div className="h-full flex flex-col items-center justify-center pb-28 px-6 py-8 text-center">
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: `${accentHex}1A` }}
                >
                    <Lock className="w-8 h-8" style={{ color: accentColor }} strokeWidth={1.5} />
                </div>
                <h2 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>Fasting Journal</h2>
                <p className="text-sm font-light leading-relaxed max-w-xs" style={{ color: 'var(--text-dim)' }}>
                    Create an account to save your fasting journey and track your progress across sessions.
                </p>
                <p className="mt-6 text-xs" style={{ color: 'var(--text-dim)', opacity: 0.5 }}>
                    Go to <span style={{ color: accentColor }}>Account</span> tab to sign up — it's free.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto pb-28 px-6 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-7 h-7" style={{ color: accentColor }} />
                    <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--text)' }}>
                        Fasting Journal
                    </h2>
                </div>
                <p className="text-sm font-light" style={{ color: 'var(--text-dim)' }}>
                    Track your fasting journey with dignity
                </p>
            </div>

            {/* Monthly Summary */}
            <div className="relative overflow-hidden mb-8">
                <div
                    className="absolute inset-0 rounded-3xl"
                    style={{ background: 'var(--card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow)' }}
                />
                <div className="relative px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
                            className="p-2 rounded-xl transition-colors"
                            style={{ color: 'var(--text-dim)' }}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h3 className="font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--text)' }}>
                            {format(currentMonth, 'MMMM yyyy')}
                        </h3>
                        <button
                            onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
                            className="p-2 rounded-xl transition-colors"
                            style={{ color: 'var(--text-dim)' }}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold" style={{ color: accentColor }}>{fastedCount}</p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Fasted</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold" style={{ color: accentColorDim }}>{voluntaryCount}</p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Voluntary</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold" style={{ color: 'var(--text-dim)', opacity: 0.5 }}>{missedCount}</p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Missed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="relative overflow-hidden">
                <div
                    className="absolute inset-0 rounded-3xl"
                    style={{ background: 'var(--card)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow)' }}
                />
                <div className="relative px-6 py-6">
                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <div key={i} className="text-center text-xs font-semibold uppercase" style={{ color: 'var(--text-dim)' }}>
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}
                        {daysInMonth.map(date => {
                            const status = getDayStatus(date);
                            const isToday = isSameDay(date, new Date());
                            return (
                                <button
                                    key={date.toISOString()}
                                    onClick={() => handleDayClick(date)}
                                    className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200 relative ${isToday ? 'ring-2' : ''}`}
                                    style={{
                                        ...(isToday ? { '--tw-ring-color': `${accentHex}80` } as React.CSSProperties : {}),
                                        ...(!status ? { background: 'var(--bg-light)', color: 'var(--text)' } : {}),
                                        ...(status?.status === 'fasted' ? { backgroundColor: `${accentHex}33`, color: accentHex } : {}),
                                        ...(status?.status === 'voluntary' ? { backgroundColor: `${accentDimHex}33`, color: accentDimHex } : {}),
                                        ...(status?.status === 'missed' ? { backgroundColor: 'rgba(148,163,184,0.1)', color: 'rgba(148,163,184,0.5)' } : {}),
                                    }}
                                >
                                    <span className="relative z-10">{format(date, 'd')}</span>
                                    {status && (
                                        <div className="absolute top-0.5 right-0.5">
                                            {status.status === 'fasted' && <Check className="w-3 h-3" />}
                                            {status.status === 'voluntary' && <Star className="w-3 h-3" />}
                                            {status.status === 'missed' && <X className="w-3 h-3" />}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 pt-4 flex flex-wrap gap-4 text-xs" style={{ borderTop: '1px solid var(--border-card)' }}>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: `${accentHex}33` }} />
                            <span style={{ color: 'var(--text-dim)' }}>Fasted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: `${accentDimHex}33` }} />
                            <span style={{ color: 'var(--text-dim)' }}>Voluntary</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ background: 'rgba(148,163,184,0.1)' }} />
                            <span style={{ color: 'var(--text-dim)' }}>Missed</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-center text-xs mt-6 font-light" style={{ color: 'var(--text-dim)', opacity: 0.6 }}>
                Tap a day to cycle: Fasted → Voluntary → Missed → Clear
            </p>
        </div>
    );
};
