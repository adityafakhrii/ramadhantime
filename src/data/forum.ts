export interface ForumComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  arabicText?: string;
  category: 'doa' | 'status' | 'sharing' | 'tausiyah';
  timestamp: string;
  doaCount: number;
  commentCount: number;
  shareCount: number;
  comments: ForumComment[];
}

export const FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    userId: 'user-1',
    userName: 'Ahmad Fauzi',
    userAvatar: '🧔',
    content: 'Ya Allah, mudahkanlah urusan kami hari ini. Berikan kami kekuatan untuk menjalani hari dengan penuh keikhlasan dan kesabaran. Aamiin. 🤲',
    category: 'doa',
    timestamp: '2 jam lalu',
    doaCount: 128,
    commentCount: 12,
    shareCount: 34,
    comments: [
      { id: 'c1-1', userId: 'user-2', userName: 'Siti Aisyah', userAvatar: '👩‍🦱', content: 'Aamiin Ya Rabbal Alamin 🤲', timestamp: '1 jam lalu' },
      { id: 'c1-2', userId: 'user-3', userName: 'Muhammad Rizki', userAvatar: '👨', content: 'Aamiin, semoga kita semua dimudahkan', timestamp: '1 jam lalu' },
      { id: 'c1-3', userId: 'user-5', userName: 'Fatimah Zahra', userAvatar: '🧕', content: 'Aamiin, jazakallah khairan sudah mengingatkan 🤲', timestamp: '45 menit lalu' },
    ]
  },
  {
    id: 'post-2',
    userId: 'user-2',
    userName: 'Siti Aisyah',
    userAvatar: '👩‍🦱',
    content: 'Alhamdulillah, hari ini bisa khatam Al-Quran untuk ke-3 kalinya tahun ini. Semoga Allah menerima ibadah kita semua. 📖✨',
    category: 'sharing',
    timestamp: '3 jam lalu',
    doaCount: 245,
    commentCount: 28,
    shareCount: 15,
    comments: [
      { id: 'c2-1', userId: 'user-1', userName: 'Ahmad Fauzi', userAvatar: '🧔', content: 'MasyaAllah, barakallah fii umrik! 💚', timestamp: '2 jam lalu' },
      { id: 'c2-2', userId: 'user-4', userName: 'Umar Said', userAvatar: '🧑', content: 'Semangat! InsyaAllah tahun ini bisa 5x khatam 💪', timestamp: '2 jam lalu' },
    ]
  },
  {
    id: 'post-3',
    userId: 'user-3',
    userName: 'Muhammad Rizki',
    userAvatar: '👨',
    content: 'Doakan keluarga saya yang sedang sakit ya teman-teman. Semoga Allah memberikan kesembuhan yang sempurna.',
    arabicText: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأسَ اشْفِهِ وَأَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا',
    category: 'doa',
    timestamp: '5 jam lalu',
    doaCount: 512,
    commentCount: 45,
    shareCount: 67,
    comments: [
      { id: 'c3-1', userId: 'user-2', userName: 'Siti Aisyah', userAvatar: '👩‍🦱', content: 'Semoga lekas sembuh ya, Aamiin 🤲', timestamp: '4 jam lalu' },
      { id: 'c3-2', userId: 'user-5', userName: 'Fatimah Zahra', userAvatar: '🧕', content: 'Aamiin, mudah-mudahan segera pulih 💚', timestamp: '4 jam lalu' },
      { id: 'c3-3', userId: 'user-6', userName: 'Bilal Hakim', userAvatar: '🧔‍♂️', content: 'Yang sabar ya akhi, insyaAllah ada hikmahnya', timestamp: '3 jam lalu' },
    ]
  },
  {
    id: 'post-4',
    userId: 'user-4',
    userName: 'Umar Said',
    userAvatar: '🧑',
    content: '"Barang siapa yang menempuh suatu jalan untuk menuntut ilmu, maka Allah akan memudahkan baginya jalan ke surga." (HR. Muslim)\n\nSemangat menuntut ilmu! 📚',
    category: 'tausiyah',
    timestamp: '6 jam lalu',
    doaCount: 89,
    commentCount: 8,
    shareCount: 42,
    comments: [
      { id: 'c4-1', userId: 'user-1', userName: 'Ahmad Fauzi', userAvatar: '🧔', content: 'Jazakallah khairan, sangat menginspirasi! 🔥', timestamp: '5 jam lalu' },
      { id: 'c4-2', userId: 'user-3', userName: 'Muhammad Rizki', userAvatar: '👨', content: 'MasyaAllah, reminder yang sangat bagus', timestamp: '5 jam lalu' },
    ]
  },
  {
    id: 'post-5',
    userId: 'user-5',
    userName: 'Fatimah Zahra',
    userAvatar: '🧕',
    content: 'Ya Allah, ampuni dosa-dosa kami, dosa kedua ibu bapak kami, dan kasihanilah mereka sebagaimana mereka mengasihi kami di waktu kecil. 🤲',
    arabicText: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    category: 'doa',
    timestamp: '8 jam lalu',
    doaCount: 876,
    commentCount: 56,
    shareCount: 123,
    comments: [
      { id: 'c5-1', userId: 'user-1', userName: 'Ahmad Fauzi', userAvatar: '🧔', content: 'Aamiin Ya Rabb, semoga orangtua kita semuanya dirahmati 🤲', timestamp: '7 jam lalu' },
      { id: 'c5-2', userId: 'user-2', userName: 'Siti Aisyah', userAvatar: '👩‍🦱', content: 'Aamiin, doa yang sangat menyentuh 😭🤲', timestamp: '7 jam lalu' },
      { id: 'c5-3', userId: 'user-7', userName: 'Khadijah Nur', userAvatar: '👩', content: 'Aamiin... semoga kita bisa berbakti kepada orang tua', timestamp: '6 jam lalu' },
    ]
  },
  {
    id: 'post-6',
    userId: 'user-6',
    userName: 'Bilal Hakim',
    userAvatar: '🧔‍♂️',
    content: 'Tips shalat khusyuk yang saya pelajari dari ustadz:\n\n1. Pahami makna bacaan shalat\n2. Bayangkan sedang berdiri di hadapan Allah\n3. Jangan tergesa-gesa\n4. Matikan HP atau jauhkan dari tempat shalat\n5. Berwudhu dengan tenang\n\nSemoga bermanfaat! 🕌',
    category: 'tausiyah',
    timestamp: '10 jam lalu',
    doaCount: 156,
    commentCount: 19,
    shareCount: 88,
    comments: [
      { id: 'c6-1', userId: 'user-4', userName: 'Umar Said', userAvatar: '🧑', content: 'Jazakallah, sangat bermanfaat! Bagikan terus ilmunya ya akhi', timestamp: '9 jam lalu' },
      { id: 'c6-2', userId: 'user-5', userName: 'Fatimah Zahra', userAvatar: '🧕', content: 'Nomor 4 paling sulit 😅 tapi insyaAllah bisa!', timestamp: '9 jam lalu' },
    ]
  },
  {
    id: 'post-7',
    userId: 'user-7',
    userName: 'Khadijah Nur',
    userAvatar: '👩',
    content: 'Alhamdulillah bisa bangun tahajjud 7 hari berturut-turut. Awalnya berat, tapi setelah istiqomah subhanallah rasanya luar biasa 🌙✨\n\nSiapa yang mau challenge tahajjud bareng?',
    category: 'status',
    timestamp: '12 jam lalu',
    doaCount: 342,
    commentCount: 34,
    shareCount: 21,
    comments: [
      { id: 'c7-1', userId: 'user-2', userName: 'Siti Aisyah', userAvatar: '👩‍🦱', content: 'MasyaAllah, saya mau ikut challenge! 🙋‍♀️', timestamp: '11 jam lalu' },
      { id: 'c7-2', userId: 'user-1', userName: 'Ahmad Fauzi', userAvatar: '🧔', content: 'Barakallah! InsyaAllah ikut, saling mengingatkan ya', timestamp: '11 jam lalu' },
      { id: 'c7-3', userId: 'user-6', userName: 'Bilal Hakim', userAvatar: '🧔‍♂️', content: 'Count me in! 💪 #TahajjudChallenge', timestamp: '10 jam lalu' },
    ]
  },
  {
    id: 'post-8',
    userId: 'user-8',
    userName: 'Hasan Basri',
    userAvatar: '👴',
    content: 'Doakan istri saya sedang dalam proses persalinan. Mohon doanya agar dimudahkan dan dilancarkan, ibu dan bayi sehat selamat. 🤲',
    arabicText: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا',
    category: 'doa',
    timestamp: '14 jam lalu',
    doaCount: 1024,
    commentCount: 78,
    shareCount: 45,
    comments: [
      { id: 'c8-1', userId: 'user-5', userName: 'Fatimah Zahra', userAvatar: '🧕', content: 'Aamiin! Semoga dimudahkan, ibu dan bayi sehat 🤲💚', timestamp: '13 jam lalu' },
      { id: 'c8-2', userId: 'user-3', userName: 'Muhammad Rizki', userAvatar: '👨', content: 'Aamiin ya Rabb, kami doakan dari sini 🤲', timestamp: '13 jam lalu' },
      { id: 'c8-3', userId: 'user-7', userName: 'Khadijah Nur', userAvatar: '👩', content: 'Ya Allah mudahkan, sehat ibu dan bayinya 🤲', timestamp: '12 jam lalu' },
    ]
  },
  {
    id: 'post-9',
    userId: 'user-9',
    userName: 'Zainal Abidin',
    userAvatar: '🧑‍🦳',
    content: '"Sesungguhnya sesudah kesulitan itu ada kemudahan." (QS. Al-Insyirah: 6)\n\nBuat yang lagi ngerasa berat, kuat ya! Allah ga akan kasih cobaan melebihi kemampuan kita. 💪🤲',
    category: 'tausiyah',
    timestamp: '16 jam lalu',
    doaCount: 423,
    commentCount: 31,
    shareCount: 95,
    comments: [
      { id: 'c9-1', userId: 'user-2', userName: 'Siti Aisyah', userAvatar: '👩‍🦱', content: 'Terima kasih remindernya, pas banget lagi butuh 😭💚', timestamp: '15 jam lalu' },
      { id: 'c9-2', userId: 'user-4', userName: 'Umar Said', userAvatar: '🧑', content: 'MasyaAllah, semoga kita semua kuat menghadapi ujian-Nya', timestamp: '15 jam lalu' },
    ]
  },
  {
    id: 'post-10',
    userId: 'user-10',
    userName: 'Nurul Hidayah',
    userAvatar: '👧',
    content: 'Saya baru mulai belajar baca Al-Quran lagi setelah lama tidak membaca. Doakan istiqomah ya! Ga ada kata terlambat untuk kembali kepada Allah. 📖🤲',
    category: 'status',
    timestamp: '1 hari lalu',
    doaCount: 567,
    commentCount: 42,
    shareCount: 38,
    comments: [
      { id: 'c10-1', userId: 'user-1', userName: 'Ahmad Fauzi', userAvatar: '🧔', content: 'MasyaAllah, semangat! Yang penting niatnya sudah baik 💪', timestamp: '20 jam lalu' },
      { id: 'c10-2', userId: 'user-5', userName: 'Fatimah Zahra', userAvatar: '🧕', content: 'Allahumma barik, semoga istiqomah ya ukhti 🤲💚', timestamp: '18 jam lalu' },
      { id: 'c10-3', userId: 'user-7', userName: 'Khadijah Nur', userAvatar: '👩', content: 'Coba pake fitur Al-Quran di app ini, enak banget baca sambil dengerin murottal!', timestamp: '16 jam lalu' },
    ]
  },
];
