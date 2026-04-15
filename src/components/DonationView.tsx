import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronDown, ChevronUp, Copy, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const NOMINAL_OPTIONS = [
  { value: 10000, label: 'Rp 10.000' },
  { value: 25000, label: 'Rp 25.000' },
  { value: 50000, label: 'Rp 50.000' },
  { value: 100000, label: 'Rp 100.000' },
  { value: 250000, label: 'Rp 250.000' },
  { value: 500000, label: 'Rp 500.000' },
];

const PAYMENT_METHODS = [
  { id: 'bsi', name: 'BSI (Bank Syariah Indonesia)', account: '7210-2890-11', holder: 'Akyash Pro Foundation' },
  { id: 'dana', name: 'DANA', account: '0812-3456-7890', holder: 'Akyash Pro' },
  { id: 'gopay', name: 'GoPay', account: '0812-3456-7890', holder: 'Akyash Pro' },
];

export function DonationView() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNominal, setSelectedNominal] = useState<number | null>(null);
  const [customNominal, setCustomNominal] = useState('');
  const [donorName, setDonorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const getSelectedAmount = (): number => {
    if (customNominal) return parseInt(customNominal.replace(/\D/g, ''), 10) || 0;
    return selectedNominal || 0;
  };

  const handleCustomInput = (value: string) => {
    // Only allow numbers
    const numericOnly = value.replace(/\D/g, '');
    setCustomNominal(numericOnly);
    if (numericOnly) {
      setSelectedNominal(null);
    }
  };

  const handleSelectNominal = (val: number) => {
    setSelectedNominal(val);
    setCustomNominal('');
  };

  const handleProceed = () => {
    const amount = getSelectedAmount();
    if (amount < 1000) {
      toast.error('Minimal donasi Rp 1.000');
      return;
    }
    if (!isAnonymous && !donorName.trim()) {
      toast.error('Isi nama donatur atau centang Hamba Allah');
      return;
    }
    setShowPayment(true);
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text.replace(/-/g, ''));
      setCopiedId(id);
      toast.success('Nomor rekening disalin!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Gagal menyalin');
    }
  };

  const handleReset = () => {
    setShowPayment(false);
    setSelectedNominal(null);
    setCustomNominal('');
    setDonorName('');
    setIsAnonymous(false);
  };

  const amount = getSelectedAmount();

  return (
    <div className="rounded-2xl shadow-neu bg-background overflow-hidden">
      {/* Header — always visible */}
      <button
        className="w-full p-5 flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm text-foreground">Donasi</p>
            <p className="text-xs text-muted-foreground">Bantu pengembangan Akyash Pro</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-5">
              {!showPayment ? (
                <>
                  {/* Nominal Selection */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Pilih Nominal</p>
                    <div className="grid grid-cols-3 gap-2">
                      {NOMINAL_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSelectNominal(opt.value)}
                          className={`
                            py-2.5 px-2 rounded-xl text-xs font-semibold transition-all duration-200 border
                            ${selectedNominal === opt.value && !customNominal
                              ? 'bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]'
                              : 'bg-background border-border text-foreground hover:border-primary/50 hover:bg-primary/5'}
                          `}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Nominal */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Atau Input Manual</p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">Rp</span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Nominal lainnya..."
                        value={customNominal ? parseInt(customNominal).toLocaleString('id-ID') : ''}
                        onChange={(e) => handleCustomInput(e.target.value)}
                        className="pl-9 text-sm rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Donor Name */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Nama Donatur</p>
                    <Input
                      type="text"
                      placeholder={isAnonymous ? 'Hamba Allah' : 'Masukkan nama Anda...'}
                      value={isAnonymous ? '' : donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      disabled={isAnonymous}
                      className={`text-sm rounded-xl ${isAnonymous ? 'opacity-50' : ''}`}
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                      <div
                        onClick={() => {
                          setIsAnonymous(!isAnonymous);
                          if (!isAnonymous) setDonorName('');
                        }}
                        className={`
                          w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shrink-0
                          ${isAnonymous
                            ? 'bg-primary border-primary'
                            : 'border-border hover:border-primary/50'
                          }
                        `}
                      >
                        {isAnonymous && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </motion.svg>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">Hamba Allah (anonim)</span>
                    </label>
                  </div>

                  {/* Summary & Proceed */}
                  {amount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-primary/5 border border-primary/20 p-4"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Total Donasi</span>
                        <span className="text-xs text-muted-foreground">
                          {isAnonymous ? 'Hamba Allah' : donorName || '—'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-foreground">{formatCurrency(amount)}</p>
                    </motion.div>
                  )}

                  <Button
                    onClick={handleProceed}
                    disabled={amount < 1000}
                    className="w-full rounded-xl h-11 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold shadow-md"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Lanjut ke Pembayaran
                  </Button>
                </>
              ) : (
                /* Payment Details */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {/* Summary Header */}
                  <div className="rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-600/10 border border-pink-500/20 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Donasi sebesar</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(amount)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Atas nama: <span className="font-semibold text-foreground">{isAnonymous ? 'Hamba Allah' : donorName}</span>
                    </p>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Transfer ke salah satu rekening</p>
                    <div className="space-y-2">
                      {PAYMENT_METHODS.map((pm) => (
                        <div
                          key={pm.id}
                          className="rounded-xl border border-border p-3 flex items-center justify-between hover:border-primary/30 transition-colors"
                        >
                          <div>
                            <p className="text-xs font-semibold text-foreground">{pm.name}</p>
                            <p className="text-sm font-mono-timer font-bold text-primary mt-0.5">{pm.account}</p>
                            <p className="text-[10px] text-muted-foreground">a.n. {pm.holder}</p>
                          </div>
                          <button
                            onClick={() => handleCopy(pm.account, pm.id)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title="Salin nomor rekening"
                          >
                            {copiedId === pm.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                    Setelah transfer, konfirmasi ke WhatsApp admin di <span className="font-semibold text-foreground">0812-3456-7890</span> dengan bukti transfer.
                    Jazakallahu khairan! 🤲
                  </p>

                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full rounded-xl h-10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Donasi Lagi / Kembali
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
