import { useMemo } from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const QUOTES = [
    { text: "Berpuasalah kalian niscaya kalian akan sehat.", source: "HR. Ath-Thabrani" },
    { text: "Barangsiapa berpuasa Ramadhan atas dasar iman dan mengharap pahala dari Allah, maka dosanya yang telah lalu akan diampuni.", source: "HR. Bukhari no. 38" },
    { text: "Hai orang-orang yang beriman, diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang-orang sebelum kamu agar kamu bertakwa.", source: "QS. Al-Baqarah: 183" },
    { text: "Bulan Ramadhan adalah (bulan) yang di dalamnya diturunkan Al-Qur'an, sebagai petunjuk bagi manusia dan penjelasan-penjelasan mengenai petunjuk itu dan pembeda (antara yang benar dan yang batil).", source: "QS. Al-Baqarah: 185" },
    { text: "Tiga doa yang tidak tertolak: doa orang yang berpuasa ketika berbuka, doa pemimpin yang adil, dan doa orang yang terzalimi.", source: "HR. Tirmidzi" },
    { text: "Makan sahurlah kalian karena dalam makan sahur terdapat keberkahan.", source: "HR. Muttafaqun 'alaih" },
    { text: "Puasa itu adalah perisai (dari kemaksiatan dan siksa neraka).", source: "HR. Bukhari no. 1894" }
];

export const DailyQuote = () => {
    // Use today's date to pick a consistent quote for the day
    const dailyQuote = useMemo(() => {
        const today = new Date();
        // Simple hash based on year, month, and day
        const dayIndex = (today.getFullYear() + today.getMonth() + today.getDate()) % QUOTES.length;
        return QUOTES[dayIndex];
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="px-5 mb-5"
        >
            <div className="rounded-2xl shadow-neu-sm p-5 bg-background border border-border/50 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-primary/5">
                    <Quote className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                        <Quote className="w-4 h-4 fill-current" />
                        <span className="text-xs font-semibold tracking-wider uppercase">Kutipan Hari Ini</span>
                    </div>
                    <p className="text-sm font-medium text-foreground leading-relaxed italic mb-3">
                        "{dailyQuote.text}"
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold">
                        — {dailyQuote.source}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
