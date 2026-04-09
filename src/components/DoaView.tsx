import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DOA_CATEGORIES } from "@/data/doa";
import { TasbihCounter } from "@/components/TasbihCounter";

type DoaTab = 'doa' | 'tasbih';

export const DoaView = () => {
    const [tab, setTab] = useState<DoaTab>('doa');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-6 px-4 pb-20 h-[calc(100vh-4rem)] flex flex-col"
        >
            <div className="flex items-center gap-3 mb-4 shrink-0">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <BookOpen className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Doa & Dzikir</h2>
                    <p className="text-sm text-muted-foreground">Doa, Niat & Tasbih Digital</p>
                </div>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-2 mb-4 shrink-0">
                <button
                    onClick={() => setTab('doa')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        tab === 'doa' ? 'bg-foreground text-background shadow-neu-sm' : 'bg-muted/30 text-muted-foreground'
                    }`}
                >
                    Kumpulan Doa
                </button>
                <button
                    onClick={() => setTab('tasbih')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        tab === 'tasbih' ? 'bg-foreground text-background shadow-neu-sm' : 'bg-muted/30 text-muted-foreground'
                    }`}
                >
                    Tasbih Digital
                </button>
            </div>

            <div className="flex-1 overflow-hidden">
                {tab === 'doa' ? (
                    <ScrollArea className="h-full pr-3">
                        <div className="space-y-8 pb-10">
                            {DOA_CATEGORIES.map((cat) => (
                                <section key={cat.title}>
                                    <h3 className="text-base font-bold text-foreground mb-3 px-1 border-l-4 border-primary pl-3 sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
                                        {cat.title}
                                    </h3>
                                    <Accordion type="single" collapsible className="w-full space-y-3">
                                        {cat.items.map((doa) => (
                                            <AccordionItem
                                                key={doa.id}
                                                value={doa.id}
                                                className="bg-muted/30 rounded-2xl border border-border/50 px-2"
                                            >
                                                <AccordionTrigger className="hover:no-underline px-3 py-4 text-left font-semibold text-foreground flex gap-3 text-sm">
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
                                </section>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <ScrollArea className="h-full pr-3">
                        <div className="pb-10">
                            <TasbihCounter />
                        </div>
                    </ScrollArea>
                )}
            </div>
        </motion.div>
    );
};
