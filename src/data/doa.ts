export interface DoaItem {
    id: string;
    title: string;
    arab: string;
    latin: string;
    arti: string;
}

export interface DoaCategory {
    title: string;
    items: DoaItem[];
}

export const DOA_CATEGORIES: DoaCategory[] = [
    {
        title: "Amalan Ramadhan",
        items: [
            {
                id: "niat-puasa",
                title: "Niat Puasa Ramadhan",
                arab: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى",
                latin: "Nawaitu shauma ghadin 'an adaa'i fardhi syahri ramadhaana haadzihis sanati lillaahi ta'aalaa.",
                arti: "Aku niat berpuasa esok hari untuk menunaikan kewajiban puasa pada bulan Ramadhan tahun ini karena Allah Ta'ala.",
            },
            {
                id: "buka-puasa",
                title: "Doa Buka Puasa (Umum)",
                arab: "اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ",
                latin: "Allahumma laka shumtu wa bika aamantu wa 'alaa rizqika afthartu birahmatika yaa arhamar raahimiin.",
                arti: "Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka, dengan rahmat-Mu wahai Dzat Yang Maha Penyayang.",
            },
            {
                id: "buka-puasa-shahih",
                title: "Doa Buka Puasa (Shahih Riwayat Abu Daud)",
                arab: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللهُ",
                latin: "Dzahabaz zhama'u wabtallatil 'uruuqu wa tsabatal ajru, insyaa Allah.",
                arti: "Telah hilang rasa haus, telah basah urat-urat, dan telah pasti ganjaran, dengan kehendak Allah.",
            },
            {
                id: "doa-berbuka-di-tempat-orang",
                title: "Doa Apabila Berbuka Puasa Di Rumah Orang Lain",
                arab: "أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ ، وَأَكَلَ طَعَامَكُمُ الْأَبْرَارُ ، وَصَلَّتْ عَلَيْكُمُ الْمَلَائِكَةُ",
                latin: "Aftharo 'indakumus shooimoon, wa akala tho'aamakumul abroor, wa shollat 'alaikumul malaaikah.",
                arti: "Telah berbuka di tempatmu orang-orang yang puasa, telah makan makananmu orang-orang yang baik, dan malaikat telah mendoakanmu.",
            },
            {
                id: "doa-lailatul-qadar",
                title: "Doa Malam Lailatul Qadar",
                arab: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
                latin: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni.",
                arti: "Ya Allah, sesungguhnya Engkau Maha Pemaaf dan senang memaafkan, maka maafkanlah kesalahanku.",
            }
        ]
    },
    {
        title: "Panduan Tarawih & Witir",
        items: [
            {
                id: "niat-tarawih-makmum",
                title: "Niat Sholat Tarawih (Makmum)",
                arab: "اُصَلِّى سُنَّةَ التَّرَاوِيْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ مَأْمُوْمًا ِللهِ تَعَالَى",
                latin: "Ushalli sunnatat tarawiihi rak'ataini mustaqbilal qiblati ma'muuman lillahi ta'aalaa.",
                arti: "Aku niat sholat sunnah tarawih dua rakaat menghadap kiblat sebagai makmum karena Allah Ta'ala.",
            },
            {
                id: "niat-tarawih-imam",
                title: "Niat Sholat Tarawih (Imam)",
                arab: "اُصَلِّى سُنَّةَ التَّرَاوِيْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ إِمَامًا ِللهِ تَعَالَى",
                latin: "Ushalli sunnatat tarawiihi rak'ataini mustaqbilal qiblati imaaman lillahi ta'aalaa.",
                arti: "Aku niat sholat sunnah tarawih dua rakaat menghadap kiblat sebagai imam karena Allah Ta'ala.",
            },
            {
                id: "surat-pendek-tarawih",
                title: "Urutan Surat Pendek Tarawih (20 Rakaat)",
                arab: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم",
                latin: "Rakaat 1: At-Takatsur s/d Al-Lahab (selalu bergantian dgn Al-Ikhlas di Rakaat 2). Ganjil: Takatsur, Asr, Humazah, Fiil, Quraisy, Ma'un, Kautsar, Kafirun, Nasr, Lahab. Genap: Al-Ikhlas.",
                arti: "Tradisi yang umum digunakan di Indonesia untuk sholat Tarawih 20 rakaat. Pada tarawih 8 rakaat, bebas memilih urutan surat dari Ad-Dhuha hingga An-Nas.",
            },
            {
                id: "doa-kamilin",
                title: "Doa Setelah Tarawih (Kamilin)",
                arab: "اَللّٰهُمَّ اجْعَلْنَا بِالْإِيْمَانِ كَامِلِيْنَ، وَلِلْفَرَائِضِ مُؤَدِّيْنَ، وَلِلصَّلَاةِ حَافِظِيْنَ، وَلِلزَّكَاةِ فَاعِلِيْنَ، وَلِمَا عِنْدَكَ طَالِبِيْنَ، وَلِعَفْوِكَ رَاجِيْنَ، وَبِالْهُدَى مُتَمَسِّكِيْنَ، وَعَنِ اللَّغْوِ مُعْرِضِيْنَ...",
                latin: "Allahummaj'alna bil iimaani kaamiliin, wa lil faraa-idhi muaddiin, wa lish-shalaati haafidhiin, wa liz-zakaati faa'iliin, wa lima 'indaka thaalibiin, wa li 'afwika raajiin...",
                arti: "Ya Allah, jadikanlah kami orang-orang yang sempurna imannya, yang memenuhi kewajiban, yang memelihara shalat, yang mengeluarkan zakat, yang mencari apa yang ada di sisi-Mu, yang mengharapkan ampunan-Mu...",
            },
            {
                id: "niat-witir-3",
                title: "Niat Sholat Witir 3 Rakaat",
                arab: "اُصَلِّى سُنَّةَ الْوِتْرِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ ِللهِ تَعَالَى",
                latin: "Ushalli sunnatal witri tsalaatsa raka'aatin mustaqbilal qiblati lillahi ta'aalaa.",
                arti: "Aku menyengaja sholat sunnah witir tiga rakaat menghadap kiblat karena Allah Ta'ala.",
            },
            {
                id: "wirid-witir",
                title: "Wirid Setelah Sholat Witir",
                arab: "سُبْحَانَ الْمَلِكِ الْقُدُّوسِ (٣×) سُبُّوحٌ قُدُّوسٌ رَبُّنَا وَرَبُّ الْمَلَائِكَةِ وَالرُّوحِ",
                latin: "Subhaanal malikil qudduus (3x, dibaca nyaring pada bacaan ketiga). Subbuuhun qudduusun rabbunaa wa rabbul malaa-ikati war ruuh.",
                arti: "Maha Suci Allah Yang Maha Merajai lagi Maha Suci (3x). Maha Suci lagi Quddus Tuhan kami, Tuhan para malaikat dan Jibril.",
            },
            {
                id: "doa-witir",
                title: "Doa Setelah Sholat Witir",
                arab: "اللَّهُمَّ إِنِّي أَعُوذُ بِرِضَاكَ مِنْ سَخَطِكَ وَبِمُعَافَاتِكَ مِنْ عُقُوبَتِكَ وَأَعُوذُ بِكَ مِنْكَ لَا أُحْصِي ثَنَاءً عَلَيْكَ أَنْتَ كَمَا أَثْنَيْتَ عَلَى نَفْسِكَ",
                latin: "Allahumma inni a’udzu biridhaka min sakhatika wa bimu’afatika min ‘uqubatika wa a’udzu bika minka la uhshi tsanaan ‘alaika anta kama atsnaita ‘ala nafsika.",
                arti: "Ya Allah, aku berlindung dengan keridhaan-Mu dari kemurkaan-Mu, dengan pemaafan-Mu dari hukuman-Mu. Dan aku berlindung kepada-Mu dari siksa-Mu. Aku tidak mampu menghitung pujian dan sanjungan kepada-Mu.",
            },
            {
                id: "niat-tahajud",
                title: "Niat Sholat Tahajud",
                arab: "أُصَلِّيْ سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى",
                latin: "Ushallii sunnatat tahajjudi rak'ataini lillaahi ta'aalaa.",
                arti: "Aku niat sholat sunnah Tahajud dua rakaat karena Allah Ta'ala.",
            }
        ]
    },
    {
        title: "Doa Sehari-hari",
        items: [
            {
                id: "doa-sebelum-tidur",
                title: "Doa Sebelum Tidur",
                arab: "بِسْمِكَ اللّهُمَّ أَحْيَاء وَبِسْمِكَ أَمُوتُ",
                latin: "Bismika Allahumma ahyaa wa bismika amuut.",
                arti: "Dengan menyebut nama-Mu P Ya Allah, aku hidup dan dengan menyebut nama-Mu aku mati.",
            },
            {
                id: "doa-bangun-tidur",
                title: "Doa Bangun Tidur",
                arab: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
                latin: "Alhamdu lillahil ladzii ahyaanaa ba'damaa amaatanaa wa ilaihin nusyuur.",
                arti: "Segala puji bagi Allah yang telah menghidupkan kami kembali setelah sebelumnya mematikan (menidurkan) kami, dan hanya kepada-Nya lah kami akan dibangkitkan.",
            },
            {
                id: "doa-keluar-rumah",
                title: "Doa Keluar Rumah",
                arab: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ",
                latin: "Bismillaahi, tawakkaltu 'alallaahi, laa hawla wa laa quwwata illaa billaah.",
                arti: "Dengan menyebut nama Allah, aku menyerahkan diriku pada Allah dan tidak ada daya dan kekuatan selain dengan Allah saja.",
            },
            {
                id: "doa-sapu-jagat",
                title: "Doa Sapu Jagat (Kebaikan Dunia Akhirat)",
                arab: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
                latin: "Rabbanaa aatinaa fid-dunyaa hasanatan wa fil-aakhirati hasanatan wa qinaa 'adzaaban-naar.",
                arti: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat dan peliharalah kami dari siksa neraka.",
            }
        ]
    },
    {
        title: "Doa Mohon Ampun & Rezeki",
        items: [
            {
                id: "sayyidul-istighfar",
                title: "Sayyidul Istighfar (Penghulu Istighfar)",
                arab: "اللَّهُمَّ أَنْتَ رَبِّيْ لاَ إِلَـهَ إِلاَّ أَنْتَ، خَلَقْتَنِيْ وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوْءُ بِذَنْبِيْ فَاغْفِرْ لِيْ فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوْبَ إِلاَّ أَنْتَ",
                latin: "Allahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa anaa 'abduka, wa anaa 'alaa 'ahdika wa wa'dika mastatha'tu, a'uudzu bika min syarri maa shana'tu, abuu'u laka bini'matika 'alayya, wa abuu'u bidzanbii faghfir lii, fa innahu laa yaghfirudz dzunuuba illaa anta.",
                arti: "Ya Allah Engkau adalah Tuhanku. Tidak ada sesembahan yang hak kecuali Engkau. Engkau yang menciptakanku, sedang aku adalah hamba-Mu. Aku berada di atas perjanjian dengan-Mu sesuai kemampuanku. Aku berlindung kepada-Mu dari keburukan yang aku perbuat. Aku mengakui segala nikmat-Mu kepadaku dan aku mengakui dosaku kepada-Mu, maka ampunilah aku. Sesungguhnya tiada yang dapat mengampuni dosa selain Engkau.",
            },
            {
                id: "doa-ilmu-rezeki",
                title: "Doa Meminta Ilmu, Rezeki, dan Amal",
                arab: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
                latin: "Allahumma innii as'aluka 'ilman naafi'an, wa rizqan thayyiban, wa 'amalan mutaqabbalan.",
                arti: "Ya Allah, sungguh aku memohon kepada-Mu ilmu yang bermanfaat (bagi diriku dan orang lain), rizki yang halal dan amal yang diterima (di sisi-Mu).",
            }
        ]
    }
];
