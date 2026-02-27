import { useMemo } from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const QUOTES = [
    { text: "Barangsiapa berpuasa Ramadhan atas dasar iman dan mengharap pahala dari Allah, maka dosanya yang telah lalu akan diampuni.", source: "HR. Bukhari" },
    { text: "Tiga doa yang tidak tertolak: doa orang yang berpuasa, pemimpin adil, dan orang yang didzalimi.", source: "HR. Tirmidzi" },
    { text: "Wahai orang-orang yang beriman, diwajibkan atas kamu berpuasa.", source: "QS. Al-Baqarah: 183" },
    { text: "Bulan Ramadhan, bulan yang di dalamnya diturunkan permulaan Al-Qur'an.", source: "QS. Al-Baqarah: 185" },
    { text: "Puasa itu pelindung. Maka janganlah berkata kotor dan jahil.", source: "HR. Bukhari & Muslim" },
    { text: "Sebaik-baik orang di antara kalian adalah yang belajar Al-Qur'an dan mengajarkannya.", source: "HR. Bukhari" },
    { text: "Senyummu di hadapan saudaramu adalah sedekah.", source: "HR. Tirmidzi" },
    { text: "Makan sahurlah kalian, karena sesungguhnya dalam sahur itu terdapat keberkahan.", source: "HR. Muttafaqun 'alaih" },
    { text: "Jangan meremehkan kebaikan sekecil apapun, meski hanya menjumpai saudaramu dengan wajah ceria.", source: "HR. Muslim" },
    { text: "Setiap amal anak Adam dilipatgandakan. Kecuali puasa, ia untuk-Ku dan Aku yang membalasnya.", source: "HR. Muslim" },
    { text: "Sedekah dapat menghapus dosa sebagaimana air memadamkan api.", source: "HR. Tirmidzi" },
    { text: "Agama itu adalah nasihat.", source: "HR. Muslim" },
    { text: "Barangsiapa tidak meninggalkan perkataan dan perbuatan dusta, Allah tidak butuh ia meninggalkan makan dan minum.", source: "HR. Bukhari" },
    { text: "Tidaklah seorang hamba berpuasa sehari di jalan Allah melainkan Allah akan menjauhkan wajahnya dari neraka.", source: "HR. Bukhari & Muslim" },
    { text: "Shalat lima waktu, Jumat ke Jumat, dan Ramadhan ke Ramadhan adalah penghapus dosa di antaranya.", source: "HR. Muslim" },
    { text: "Barangsiapa membangun masjid karena Allah, maka Allah bangunkan baginya rumah di surga.", source: "HR. Muttafaqun 'alaih" },
    { text: "Sesungguhnya Allah menyukai orang-orang yang bertaubat dan menyukai orang-orang yang menyucikan diri.", source: "QS. Al-Baqarah: 222" },
    { text: "Amalan yang paling dicintai Allah adalah yang terus-menerus (istiqamah) walau sedikit.", source: "HR. Bukhari & Muslim" },
    { text: "Perumpamaan teman yang shalih dan teman yang buruk ialah seperti membawa minyak wangi dan pandai besi.", source: "HR. Bukhari" },
    { text: "Sesungguhnya di surga ada pintu yang bernama Ar-Rayyan, yang akan dimasuki oleh orang-orang yang berpuasa.", source: "HR. Bukhari & Muslim" },
    { text: "Urusan orang mukmin itu sungguh menakjubkan. Semua urusannya baik baginya.", source: "HR. Muslim" },
    { text: "Apabila datang bulan Ramadhan, pintu-pintu surga dibuka, pintu-pintu neraka ditutup dan setan-setan dibelenggu.", source: "HR. Bukhari & Muslim" },
    { text: "Orang yang paling berat cobaannya adalah para Nabi, kemudian yang semisal lalu yang semisal.", source: "HR. Tirmidzi" },
    { text: "Malu adalah bagian dari keimanan.", source: "HR. Bukhari & Muslim" },
    { text: "Orang miskin itu bukanlah orang yang berkeliling minta-minta, akan tetapi yang tidak punya kecukupan namun menahan diri.", source: "HR. Bukhari" },
    { text: "Wahai kaum pemuda, barangsiapa diantara kalian telah mampu maka menikahlah, karena ia lebih menundukkan pandangan.", source: "HR. Bukhari" },
    { text: "Carilah Lailatul Qadar di malam ganjil dari sepuluh hari terakhir di bulan Ramadhan.", source: "HR. Bukhari" },
    { text: "Menuntut ilmu itu wajib atas setiap Muslim.", source: "HR. Ibnu Majah" },
    { text: "Siapa yang menempuh jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga.", source: "HR. Muslim" },
    { text: "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.", source: "HR. Ahmad" }
];

export const DailyQuote = () => {
    // Use today's date to pick a consistent quote for the day
    const dailyQuote = useMemo(() => {
        const today = new Date();
        const dayIndex = (today.getDate() - 1) % QUOTES.length; // Use day of month (1-31), wrapping modulo to prevent index error
        return QUOTES[dayIndex] || QUOTES[0];
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
