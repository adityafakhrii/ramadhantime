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
                text: 'Suatu hari yang cerah, Ahmad sedang asyik berjalan-jalan memakan roti kesukaannya.',
                image: '/kids/story1_scene1.png'
            },
            {
                id: 2,
                text: 'Tiba-tiba, Ahmad melihat seekor anak kucing oranye di pinggir jalan. Meong... Meong... Kucing itu tampak sangat lapar.',
                image: '/kids/story1_scene1.png' // scene 1 reused to establish conflict
            },
            {
                id: 3,
                text: 'Ahmad merasa kasihan. Ia mematahkan separuh rotinya dan memberikannya kepada si kucing.',
                image: '/kids/story1_scene2.png'
            },
            {
                id: 4,
                text: 'Nyam, nyam, nyam! Kucing itu makan dengan sangat lahap. Ahmad pun tersenyum bahagia.',
                image: '/kids/story1_scene3.png',
                moralMessage: 'Siapa yang menyayangi makhluk di bumi, niscaya akan disayangi oleh penduduk langit. Walau hanya dengan separuh roti, sedekah itu sangat berharga!'
            }
        ]
    }
];
