import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  'Bagaimana cara shalat tahajud?',
  'Apa doa sebelum tidur?',
  'Hukum zakat fitrah?',
  'Apa sunnah di hari Jumat?',
  'Niat puasa Senin Kamis?',
  'Cara menghitung zakat mal?',
];

// Simple keyword-based template responses
const AI_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['tahajud', 'shalat malam', 'qiyamul'],
    response: 'Shalat Tahajud adalah shalat sunnah yang dikerjakan pada malam hari setelah tidur.\n\n🕐 **Waktu:** Sepertiga malam terakhir (sekitar pukul 01:00-04:00)\n\n📋 **Tata Cara:**\n1. Niat shalat Tahajud\n2. Minimal 2 rakaat, maksimal 12 rakaat\n3. Dikerjakan 2 rakaat - 2 rakaat\n4. Diakhiri dengan shalat Witir (1 atau 3 rakaat)\n\n🤲 **Doa setelah Tahajud:**\nPerbanyak istighfar dan doa pribadi, karena waktu tersebut adalah waktu mustajab.\n\n_Wallahu a\'lam._'
  },
  {
    keywords: ['doa tidur', 'sebelum tidur', 'mau tidur'],
    response: 'Berikut doa sebelum tidur yang diajarkan Rasulullah ﷺ:\n\n**Doa Sebelum Tidur:**\nبِاسْمِكَ اللّٰهُمَّ أَمُوْتُ وَأَحْيَا\n\n_"Bismikallaahumma amuutu wa ahyaa"_\n\n**Artinya:** "Dengan menyebut nama-Mu ya Allah, aku mati dan aku hidup."\n\n📌 **Sunnah sebelum tidur:**\n• Berwudhu\n• Membaca Ayat Kursi\n• Membaca 3 Qul (Al-Ikhlas, Al-Falaq, An-Nas)\n• Tidur miring ke kanan\n• Meletakkan tangan kanan di bawah pipi\n\n_Wallahu a\'lam._'
  },
  {
    keywords: ['zakat fitrah', 'fitrah'],
    response: 'Zakat Fitrah adalah zakat yang wajib dikeluarkan setiap Muslim menjelang Hari Raya Idul Fitri.\n\n💰 **Ketentuan:**\n• Jumlah: 1 sha\' (≈ 2.5 kg) makanan pokok atau senilai uangnya\n• Wajib bagi setiap Muslim yang mampu\n• Dikeluarkan untuk diri sendiri dan tanggungan\n\n⏰ **Waktu:**\n• Wajib: Sebelum shalat Idul Fitri\n• Utama: Malam atau pagi hari raya sebelum shalat\n• Boleh: 1-2 hari sebelum hari raya\n\n👥 **Penerima:** 8 golongan asnaf (fakir, miskin, amil, mualaf, budak, gharimin, fisabilillah, ibnu sabil)\n\n_Wallahu a\'lam._'
  },
  {
    keywords: ['jumat', "jum'at", 'hari jumat'],
    response: 'Berikut sunnah-sunnah di hari Jumat:\n\n✨ **Sunnah Hari Jumat:**\n1. 🚿 Mandi (ghusl) sebelum shalat Jumat\n2. 🧴 Memakai wangi-wangian\n3. 👔 Memakai pakaian terbaik\n4. 📿 Memperbanyak shalawat kepada Nabi ﷺ\n5. 📖 Membaca Surah Al-Kahfi\n6. 🤲 Berdoa di waktu mustajab (antara Ashar-Maghrib)\n7. 🕌 Berangkat awal ke masjid\n8. ✂️ Memotong kuku\n\n📌 **Waktu mustajab doa:** Rasulullah ﷺ bersabda ada satu waktu di hari Jumat yang doa pasti dikabulkan.\n\n_Wallahu a\'lam._'
  },
  {
    keywords: ['puasa senin', 'puasa kamis', 'senin kamis'],
    response: 'Niat Puasa Sunnah Senin & Kamis:\n\n**Niat Puasa Senin:**\nنَوَيْتُ صَوْمَ يَوْمِ الْإِثْنَيْنِ سُنَّةً لِلّٰهِ تَعَالَى\n\n**Niat Puasa Kamis:**\nنَوَيْتُ صَوْمَ يَوْمِ الْخَمِيْسِ سُنَّةً لِلّٰهِ تَعَالَى\n\n📌 **Keutamaan:**\n• Amalan dihadapkan kepada Allah pada hari tersebut\n• Rasulullah ﷺ rutin berpuasa Senin-Kamis\n• Mendapat pahala puasa sunnah\n• Mengendalikan hawa nafsu\n\n⏰ **Niat boleh dilakukan:**\n• Malam hari sebelumnya (lebih utama)\n• Pagi hari sebelum Dzuhur (jika belum makan/minum)\n\n_Wallahu a\'lam._'
  },
  {
    keywords: ['zakat mal', 'hitung zakat', 'zakat harta', 'menghitung zakat'],
    response: 'Cara menghitung Zakat Mal (Zakat Harta):\n\n💰 **Rumus:** 2.5% × Total Harta yang sudah mencapai Nisab\n\n📊 **Nisab:** Setara 85 gram emas murni (± Rp85.000.000)\n\n📋 **Contoh Perhitungan:**\n• Total harta: Rp200.000.000\n• Zakat: 2.5% × Rp200.000.000 = **Rp5.000.000**\n\n✅ **Syarat Wajib:**\n1. Muslim\n2. Merdeka\n3. Harta mencapai nisab\n4. Harta dimiliki selama 1 tahun (haul)\n5. Harta berkembang/produktif\n\n📱 Kamu bisa gunakan fitur **Kalkulator Zakat** di menu Beranda untuk menghitung secara otomatis!\n\n_Wallahu a\'lam._'
  },
  {
    keywords: ['shalat', 'solat', 'salat'],
    response: 'Shalat adalah tiang agama Islam dan merupakan ibadah wajib yang harus dilakukan 5 kali sehari.\n\n🕐 **5 Waktu Shalat Wajib:**\n1. Subuh (2 rakaat)\n2. Dzuhur (4 rakaat)\n3. Ashar (4 rakaat)\n4. Maghrib (3 rakaat)\n5. Isya (4 rakaat)\n\n📌 **Tips Khusyuk:**\n• Berwudhu dengan sempurna\n• Datang sebelum iqamah\n• Fokus pada bacaan\n• Ingat bahwa Allah melihat kita\n\nApakah ada pertanyaan lebih spesifik tentang shalat yang ingin ditanyakan?\n\n_Wallahu a\'lam._'
  },
  {
    keywords: ['doa', 'berdoa', 'mohon'],
    response: 'Berikut adab dan tips berdoa agar dikabulkan:\n\n🤲 **Adab Berdoa:**\n1. Menghadap kiblat\n2. Mengangkat kedua tangan\n3. Memulai dengan hamdalah dan shalawat\n4. Berdoa dengan penuh keyakinan\n5. Menutup doa dengan shalawat dan amin\n\n⏰ **Waktu Mustajab:**\n• Sepertiga malam terakhir\n• Antara adzan dan iqamah\n• Saat hujan turun\n• Hari Jumat (antara Ashar-Maghrib)\n• Saat sujud dalam shalat\n\n📌 **Doa Sapu Jagat:**\nرَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ\n\n_Wallahu a\'lam._'
  },
];

const DEFAULT_RESPONSE = 'Jazakallah khair atas pertanyaannya. 🤲\n\nIni adalah topik yang penting dalam Islam. Untuk memberikan jawaban yang akurat dan lengkap, saya sarankan untuk:\n\n1. 📖 Merujuk ke kitab-kitab fiqih terpercaya\n2. 🕌 Berkonsultasi dengan ustadz atau ulama setempat\n3. 📱 Gunakan fitur Al-Qur\'an & Do\'a di aplikasi ini\n\nSemoga Allah SWT memberikan kemudahan dalam mencari ilmu. Aamiin.\n\n_Wallahu a\'lam._';

function getAIResponse(question: string): Promise<string> {
  const q = question.toLowerCase();
  return new Promise(resolve => {
    setTimeout(() => {
      const match = AI_RESPONSES.find(r => r.keywords.some(k => q.includes(k)));
      resolve(match ? match.response : DEFAULT_RESPONSE);
    }, 800 + Math.random() * 1200);
  });
}

// Parse inline **bold** and _italic_ markdown
function renderMarkdown(text: string): React.ReactNode[] {
  // Split by **bold** and _italic_ patterns
  const parts: React.ReactNode[] = [];
  // Regex: match **bold** or _italic_ (not inside words for italic)
  const regex = /(\*\*(.+?)\*\*)|(\b_(.+?)_\b)|(_(.+?)_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Push text before this match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      // **bold**
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[4] || match[6]) {
      // _italic_
      const content = match[4] || match[6];
      parts.push(<em key={match.index} className="text-muted-foreground text-xs">{content}</em>);
    }
    lastIndex = match.index + match[0].length;
  }
  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [text];
}

export const AIChatView = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'ai', text: 'Assalamu\'alaikum! 👋\n\nSaya **Ustadz AI Akyash**, asisten virtual yang siap membantu menjawab pertanyaan seputar Islam.\n\nSilakan tanyakan apa saja tentang ibadah, fiqih, doa, atau kehidupan Islami. 🤲', timestamp: 'Sekarang' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await getAIResponse(text);

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      role: 'ai',
      text: response,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-background w-full max-w-lg h-[85vh] sm:h-[80vh] sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border/30 flex items-center gap-3 shrink-0 bg-primary/5">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  Ustadz AI
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </h3>
                <p className="text-[10px] text-muted-foreground">Tanya seputar Islam • Prototipe</p>
              </div>
              <button onClick={onClose} className="p-2 bg-muted/50 rounded-full text-muted-foreground hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                    {msg.role === 'ai' && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center">
                          <Bot className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-semibold">Ustadz AI</span>
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted/30 text-foreground rounded-bl-md border border-border/20'
                    }`}>
                      {msg.text.split('\n').map((line, i) => (
                        <span key={i}>
                          {renderMarkdown(line)}
                          {i < msg.text.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                    <p className={`text-[10px] text-muted-foreground mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-muted/30 rounded-2xl rounded-bl-md px-4 py-3 border border-border/20">
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">Sedang mengetik...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggested questions (only show at start) */}
              {messages.length <= 1 && !isTyping && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2 font-semibold">💡 Coba tanyakan:</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border/30 shrink-0 bg-background">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Tanya Ustadz AI..."
                  disabled={isTyping}
                  className="flex-1 bg-muted/20 rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border/30 disabled:opacity-60"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                ⚠️ Prototipe — Jawaban bersifat template, bukan AI sesungguhnya
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
