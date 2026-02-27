import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const DOA_LIST = [
    {
        id: "niat-puasa",
        title: "Niat Puasa Ramadhan",
        arab: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى",
        latin: "Nawaitu shauma ghadin 'an adaa'i fardhi syahri ramadhaana haadzihis sanati lillaahi ta'aalaa.",
        arti: "Aku niat berpuasa esok hari untuk menunaikan kewajiban puasa pada bulan Ramadhan tahun ini karena Allah Ta'ala.",
    },
    {
        id: "buka-puasa",
        title: "Doa Buka Puasa",
        arab: "اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ",
        latin: "Allahumma laka shumtu wa bika aamantu wa 'alaa rizqika afthartu birahmatika yaa arhamar raahimiin.",
        arti: "Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka, dengan rahmat-Mu wahai Dzat Yang Maha Penyayang.",
    },
    {
        id: "buka-puasa-shahih",
        title: "Doa Buka Puasa (Riwayat Abu Daud)",
        arab: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللهُ",
        latin: "Dzahabaz zhama'u wabtallatil 'uruuqu wa tsabatal ajru, insyaa Allah.",
        arti: "Telah hilang rasa haus, telah basah urat-urat, dan telah pasti ganjaran, dengan kehendak Allah.",
    },
    {
        id: "niat-tarawih",
        title: "Niat Sholat Tarawih (Makmum)",
        arab: "اُصَلِّى سُنَّةَ التَّرَاوِيْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ مَأْمُوْمًا ِللهِ تَعَالَى",
        latin: "Ushalli sunnatat tarawiihi rak'ataini mustaqbilal qiblati ma'muuman lillahi ta'aalaa.",
        arti: "Aku niat sholat sunnah tarawih dua rakaat menghadap kiblat sebagai makmum karena Allah Ta'ala.",
    },
    {
        id: "niat-witir-3",
        title: "Niat Sholat Witir 3 Rakaat",
        arab: "اُصَلِّى سُنَّةَ الْوِتْرِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ ِللهِ تَعَالَى",
        latin: "Ushalli sunnatal witri tsalaatsa raka'aatin mustaqbilal qiblati lillahi ta'aalaa.",
        arti: "Aku menyengaja sholat sunnah witir tiga rakaat menghadap kiblat karena Allah Ta'ala.",
    }
];

export const DoaView = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-6 px-5 pb-24 space-y-4"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <BookOpen className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Kumpulan Doa</h2>
                    <p className="text-sm text-muted-foreground">Doa & Niat Sehari-hari di Bulan Ramadhan</p>
                </div>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
                {DOA_LIST.map((doa) => (
                    <AccordionItem
                        key={doa.id}
                        value={doa.id}
                        className="bg-background rounded-2xl shadow-neu-sm border-none px-2"
                    >
                        <AccordionTrigger className="hover:no-underline px-3 py-4 text-left font-semibold text-foreground flex gap-3">
                            <span>{doa.title}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-4 space-y-4">
                            <div className="pt-2 text-right">
                                <p className="text-2xl leading-loose font-arabic text-foreground font-medium" dir="rtl">
                                    {doa.arab}
                                </p>
                            </div>
                            <div className="space-y-2 border-t border-border/50 pt-4">
                                <p className="text-sm text-primary italic leading-relaxed">
                                    {doa.latin}
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    "{doa.arti}"
                                </p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </motion.div>
    );
};
