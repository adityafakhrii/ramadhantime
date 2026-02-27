import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Calculator, Coins, Users, Wallet, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ZakatViewProps {
    onBack: () => void;
}

export const ZakatView = ({ onBack }: ZakatViewProps) => {
    // --- FITRAH STATE ---
    const [jiwa, setJiwa] = useState<number>(1);
    const [hargaBeras, setHargaBeras] = useState<number>(45000); // Default BAZNAS 2024/2025 approx

    // --- MAAL STATE ---
    const [tabungan, setTabungan] = useState<number>(0);
    const [emas, setEmas] = useState<number>(0);
    const [lainnya, setLainnya] = useState<number>(0);
    const [hutang, setHutang] = useState<number>(0);

    // NISAB CALCULATION
    const HARGA_EMAS_PER_GRAM = 1250000;
    const NISAB_EMAS = 85;
    const NISAB_RUPIAH = HARGA_EMAS_PER_GRAM * NISAB_EMAS;

    const totalHarta = tabungan + emas + lainnya;
    const hartaBersih = totalHarta - hutang;
    const wajibZakatMaal = hartaBersih >= NISAB_RUPIAH;
    const zakatMaal = wajibZakatMaal ? hartaBersih * 0.025 : 0;

    const formatRp = (num: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="pt-6 px-4 pb-24 h-[calc(100vh-5rem)] flex flex-col"
        >
            <div className="flex items-center gap-4 mb-6 shrink-0">
                <button
                    onClick={onBack}
                    className="p-2 bg-background border border-border hover:bg-muted rounded-xl transition-colors"
                    title="Kembali ke Beranda"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Calculator className="w-6 h-6 text-primary" /> Kalkulator Zakat
                    </h2>
                    <p className="text-sm text-muted-foreground">Hitung kewajiban zakat tahunanmu</p>
                </div>
            </div>

            <Tabs defaultValue="fitrah" className="flex-1 flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-2 shrink-0 mb-4 bg-muted/50 rounded-xl p-1">
                    <TabsTrigger value="fitrah" className="rounded-lg">Zakat Fitrah</TabsTrigger>
                    <TabsTrigger value="maal" className="rounded-lg">Zakat Maal</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-3">
                        <TabsContent value="fitrah" className="m-0 space-y-6 pb-10">
                            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    Zakat Fitrah diwajibkan bagi setiap jiwa (muslim) yang menemui bulan Ramadhan. Besaran standarnya adalah 2,5 kg atau 3,5 liter makanan pokok (beras).
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                                        <Users className="w-4 h-4 text-primary" /> Jumlah Jiwa
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={jiwa || ''}
                                        onChange={(e) => setJiwa(parseInt(e.target.value) || 0)}
                                        className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none m-0"
                                        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                                        placeholder="Contoh: 1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                                        <Coins className="w-4 h-4 text-primary" /> Nominal per Jiwa (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={hargaBeras || ''}
                                        onChange={(e) => setHargaBeras(parseInt(e.target.value) || 0)}
                                        className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none m-0"
                                        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                                        placeholder="Contoh: 45000"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1.5 ml-1">
                                        *Berdasarkan SK BAZNAS rata-rata Rp 45.000 s/d Rp 55.000
                                    </p>
                                </div>
                            </div>

                            <div className="bg-background shadow-neu-sm border border-border/50 rounded-2xl p-5 mt-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1 mt-1">Total Zakat Fitrah</h3>
                                <p className="text-3xl font-bold text-foreground tracking-tight">
                                    {formatRp(jiwa * hargaBeras)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Segera bayarkan sebelum sholat Idul Fitri dilaksanakan.
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="maal" className="m-0 space-y-6 pb-10">
                            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    Zakat Maal (harta) diwajibkan jika harta bersih ditahan selama 1 tahun (Haul) dan mencapai batas Nisab (setara 85 gram emas atau <b>{formatRp(NISAB_RUPIAH)}</b>).
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                                        <Wallet className="w-4 h-4 text-primary" /> Tabungan / Uang Tunai
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={tabungan || ''}
                                        onChange={(e) => setTabungan(parseInt(e.target.value) || 0)}
                                        className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none m-0"
                                        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                                        <Coins className="w-4 h-4 text-primary" /> Nilai Emas & Perak Ekstra
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={emas || ''}
                                        onChange={(e) => setEmas(parseInt(e.target.value) || 0)}
                                        className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none m-0"
                                        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                                        <Wallet className="w-4 h-4 text-primary" /> Aset / Surat Berharga
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={lainnya || ''}
                                        onChange={(e) => setLainnya(parseInt(e.target.value) || 0)}
                                        className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none m-0"
                                        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2 text-destructive">
                                        <AlertCircle className="w-4 h-4" /> Utang Jatuh Tempo (Pengurang)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={hutang || ''}
                                        onChange={(e) => setHutang(parseInt(e.target.value) || 0)}
                                        className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-foreground font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none m-0"
                                        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="bg-background shadow-neu-sm border border-border/50 rounded-2xl p-5 mt-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
                                <div className="flex justify-between items-end mb-4 border-b border-border/50 pb-3 mt-1">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Harta Bersih</h3>
                                        <p className="text-lg font-bold text-foreground">
                                            {formatRp(hartaBersih < 0 ? 0 : hartaBersih)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${wajibZakatMaal ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                            {wajibZakatMaal ? 'Mencapai Nisab' : 'Belum Nisab'}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Zakat Maal (2.5%)</h3>
                                <p className={`text-3xl font-bold tracking-tight ${wajibZakatMaal ? 'text-primary' : 'text-foreground/40'}`}>
                                    {formatRp(zakatMaal)}
                                </p>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </div>
            </Tabs>
        </motion.div>
    );
};
