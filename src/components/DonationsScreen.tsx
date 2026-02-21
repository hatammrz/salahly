import { Heart, Globe, Code2, Users } from 'lucide-react';

// TODO: Replace with your Stripe Payment Link from dashboard.stripe.com → Payment Links → New link
// Format: https://buy.stripe.com/xxxxx
const STRIPE_LINK = 'https://buy.stripe.com/fZu6oH5wY1BJ44K0Q1cEw00';

const breakdowns = [
    {
        icon: Globe,
        percent: 50,
        label: 'Helping Muslims Worldwide',
        description: 'Supporting communities in Gaza, Sudan, and other regions in need.',
        color: '#34d399',
        bg: 'rgba(52,211,153,0.08)',
        border: 'rgba(52,211,153,0.2)',
    },
    {
        icon: Code2,
        percent: 25,
        label: 'App Development',
        description: 'Keeping Qamar free, fast, and improving for everyone.',
        color: '#818cf8',
        bg: 'rgba(129,140,248,0.08)',
        border: 'rgba(129,140,248,0.2)',
    },
    {
        icon: Users,
        percent: 25,
        label: 'Developer Support',
        description: 'Sustaining the team behind Qamar.',
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.2)',
    },
];

export const DonationsScreen = () => {
    return (
        <div className="h-full overflow-y-auto pb-28 px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <h2 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                    Support Qamar
                </h2>
                <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                    Every donation makes a difference — for the app and for Muslims around the world.
                </p>
            </div>

            {/* Hero card */}
            <div className="relative overflow-hidden rounded-3xl mb-6">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(52,211,153,0.1) 100%)',
                        border: '1px solid rgba(236,72,153,0.25)',
                    }}
                />
                <div className="relative px-6 py-8 text-center space-y-4">
                    <div className="flex justify-center">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.25)' }}
                        >
                            <Heart className="w-8 h-8 text-pink-400" strokeWidth={1.5} />
                        </div>
                    </div>
                    <div>
                        <p className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                            Give with intention
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                            Qamar is free for everyone. Your support helps us keep it that way while
                            contributing to relief efforts for our brothers and sisters in Gaza, Sudan, and beyond.
                        </p>
                    </div>
                    <a
                        href={STRIPE_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-75"
                        style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: '#fff' }}
                    >
                        <Heart className="w-4 h-4" strokeWidth={2} />
                        Donate Now
                    </a>
                    <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                        Secure payments powered by Stripe
                    </p>
                </div>
            </div>

            {/* Breakdown */}
            <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-dim)' }}>
                    How your donation is used
                </p>
                <div className="space-y-3">
                    {breakdowns.map(({ icon: Icon, percent, label, description, color, bg, border }) => (
                        <div key={label} className="relative overflow-hidden rounded-2xl">
                            <div
                                className="absolute inset-0 rounded-2xl"
                                style={{ background: bg, border: `1px solid ${border}` }}
                            />
                            <div className="relative px-5 py-4 flex items-center gap-4">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: bg, border: `1px solid ${border}` }}
                                >
                                    <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{label}</p>
                                    </div>
                                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>{description}</p>
                                </div>
                                <div
                                    className="text-lg font-bold flex-shrink-0"
                                    style={{ color }}
                                >
                                    {percent}%
                                </div>
                            </div>
                            {/* Progress bar */}
                            <div className="relative h-1 mx-5 mb-3 rounded-full" style={{ background: 'var(--border)' }}>
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${percent}%`, background: color, opacity: 0.7 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Causes */}
            <div className="relative overflow-hidden rounded-2xl mt-4">
                <div
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: 'var(--card)', border: '1px solid var(--border-card)' }}
                />
                <div className="relative px-5 py-5">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-dim)' }}>
                        Causes we support
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {['🇵🇸 Gaza', '🇸🇩 Sudan', '🇸🇾 Syria', '🇾🇪 Yemen', '🇸🇴 Somalia', '🌍 More'].map(cause => (
                            <span
                                key={cause}
                                className="text-xs px-3 py-1.5 rounded-xl font-medium"
                                style={{ background: 'rgba(52,211,153,0.08)', color: 'var(--accent)', border: '1px solid rgba(52,211,153,0.15)' }}
                            >
                                {cause}
                            </span>
                        ))}
                    </div>
                    <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                        The 50% humanitarian portion is distributed to verified relief organizations serving Muslim communities in crisis.
                    </p>
                </div>
            </div>

            {/* Jazakallah */}
            <p className="text-center text-sm mt-6 font-light" style={{ color: 'var(--text-dim)' }}>
                جزاكم الله خيراً — May Allah reward you with goodness.
            </p>
        </div>
    );
};
