import { useSettings } from '../contexts/SettingsContext';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Calendar, Check, X, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { isRamadan } from '../utils/hijriUtils';

export const FastingJournal = () => {
    const { settings, data, addFastingDay, removeFastingDay } = useSettings();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const inRamadan = settings.ramadanMode === 'on' ||
        (settings.ramadanMode === 'auto' && isRamadan());
    const accentColor = inRamadan ? '#C6A95E' : '#34D399';
    const accentColorDim = inRamadan ? '#D4B76E' : '#10B981';

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Calculate monthly summary
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

        if (!existing) {
            addFastingDay(dateStr, 'fasted');
        } else if (existing.status === 'fasted') {
            addFastingDay(dateStr, 'voluntary');
        } else if (existing.status === 'voluntary') {
            addFastingDay(dateStr, 'missed');
        } else {
            removeFastingDay(dateStr);
        }
    };

    const getDayStatus = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return data.fastingDays.find(fd => fd.date === dateStr);
    };

    return (
        <div className="h-full overflow-y-auto pb-28 px-6 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-7 h-7" style={{ color: accentColor }} />
                    <h2 className="font-display text-3xl font-bold text-app-text">
                        Fasting Journal
                    </h2>
                </div>
                <p className="text-app-text-dim text-sm font-light">
                    Track your fasting journey with dignity
                </p>
            </div>

            {/* Monthly Summary */}
            <div className="relative overflow-hidden mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-app-card/40 to-app-card/20 rounded-3xl backdrop-blur-glass border border-white/10" />
                <div className="relative px-6 py-6">
                    {/* Month navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
                            className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-app-text-dim" />
                        </button>
                        <h3 className="font-semibold text-app-text text-sm uppercase tracking-wider">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h3>
                        <button
                            onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
                            className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-app-text-dim" />
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold" style={{ color: accentColor }}>{fastedCount}</p>
                            <p className="text-xs text-app-text-dim mt-1">Fasted</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold" style={{ color: accentColorDim }}>{voluntaryCount}</p>
                            <p className="text-xs text-app-text-dim mt-1">Voluntary</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-app-text-dim/50">{missedCount}</p>
                            <p className="text-xs text-app-text-dim mt-1">Missed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-app-card/40 to-app-card/20 rounded-3xl backdrop-blur-glass border border-white/10" />
                <div className="relative px-6 py-6">
                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <div key={i} className="text-center text-xs font-semibold text-app-text-dim uppercase">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Empty cells for days before month start */}
                        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}

                        {/* Actual days */}
                        {daysInMonth.map(date => {
                            const status = getDayStatus(date);
                            const isToday = isSameDay(date, new Date());

                            return (
                                <button
                                    key={date.toISOString()}
                                    onClick={() => handleDayClick(date)}
                                    className={`
                                        aspect-square rounded-xl flex items-center justify-center text-sm font-medium
                                        transition-all duration-200 relative
                                        ${isToday ? 'ring-2' : ''}
                                        ${!status ? 'bg-app-card/20 text-app-text hover:bg-app-card/40' : ''}
                                    `}
                                    style={{
                                        ...(isToday ? { '--tw-ring-color': `${accentColor}80` } as React.CSSProperties : {}),
                                        ...(status?.status === 'fasted' ? { backgroundColor: `${accentColor}33`, color: accentColor } : {}),
                                        ...(status?.status === 'voluntary' ? { backgroundColor: `${accentColorDim}33`, color: accentColorDim } : {}),
                                        ...(status?.status === 'missed' ? { backgroundColor: 'rgba(148, 163, 184, 0.1)', color: 'rgba(148, 163, 184, 0.5)' } : {}),
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
                    <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: `${accentColor}33` }} />
                            <span className="text-app-text-dim">Fasted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: `${accentColorDim}33` }} />
                            <span className="text-app-text-dim">Voluntary</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-app-text-dim/10" />
                            <span className="text-app-text-dim">Missed</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-center text-app-text-dim/60 text-xs mt-6 font-light">
                Tap a day to cycle: Fasted → Voluntary → Missed → Clear
            </p>
        </div>
    );
};
