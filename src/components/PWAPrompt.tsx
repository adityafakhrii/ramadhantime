import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PWAPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Tunggu sebentar sebelum memunculkan popup agar tidak bentrok dengan splash
            setTimeout(() => setShowPrompt(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-24 left-4 right-4 z-50 bg-background rounded-2xl p-4 shadow-neu flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-foreground text-background p-2 rounded-xl">
                            <Download className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-foreground">Pasang App Nya Cuy</p>
                            <p className="text-[11px] text-muted-foreground">Biar buka cepet & bisa offline</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" onClick={handleInstall} className="rounded-xl h-8 px-3 text-xs">
                            Gass Pasang!
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleDismiss} className="w-8 h-8 rounded-full text-muted-foreground">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
