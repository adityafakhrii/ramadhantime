export interface StoryPage {
    id: number;
    text: string;
    image: string;
    moralMessage?: string;
}

export interface Story {
    id: string;
    title: string;
    description: string;
    coverColor: string;
    coverImage: string;
    pages: StoryPage[];
}

export const KIDS_STORIES: Story[] = [
    {
        id: 'sedekah-kucing',
        title: 'Sedekah Sepotong Roti',
        description: 'Kisah Ahmad dan Kucing yang lapar.',
        coverColor: 'bg-amber-400',
        coverImage: '/kids/story1_cover.png',
        pages: [
            {
                id: 1,
                text: 'Suatu hari yang cerah, Ahmad berjalan-jalan di taman desa. Ia membawa bekal sepotong roti.',
                image: '/kids/story1_scene1.png'
            },
            {
                id: 2,
                text: 'Angin sepoi-sepoi bertiup sejuk. Ahmad bersenandung riang karena hari ini ia sangat gembira.',
                image: '/kids/story1_scene1.png'
            },
            {
                id: 3,
                text: 'Tiba-tiba, dari balik semak-semak terdengar suara yang sangat pelan. "Meong... Meong..."',
                image: '/kids/story1_scene1.png'
            },
            {
                id: 4,
                text: 'Seekor anak kucing kecil berwarna oranye keluar. Badannya kurus dan ia tampak sangat kelaparan.',
                image: '/kids/story1_scene1.png'
            },
            {
                id: 5,
                text: 'Kucing itu menggosokkan badannya ke kaki Ahmad sambil terus mengeong dengan nada yang menyedihkan.',
                image: '/kids/story1_scene1.png'
            },
            {
                id: 6,
                text: 'Ahmad merasa kasihan. Walaupun itu roti kesukaannya, ia mematahkan separuh rotinya untuk si kucing.',
                image: '/kids/story1_scene1.png'
            },
            {
                id: 7,
                text: 'Nyam, nyam, nyam! Kucing itu makan lahap sekali. Ahmad tersenyum lebar melihat kucing itu kembali ceria.',
                image: '/kids/story1_scene1.png',
                moralMessage: 'Siapa yang menyayangi makhluk di bumi, niscaya disayangi oleh penduduk langit. Walau hanya dengan separuh roti, sedekah itu sangat berharga!'
            }
        ]
    }
];
