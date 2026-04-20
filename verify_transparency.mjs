import jimp from 'jimp';

async function verify() {
    const img = await jimp.read('public/kids/tan_dokter.png');
    let transparentCount = 0;
    let whiteCount = 0;
    for (let i = 0; i < img.bitmap.data.length; i += 4) {
        if (img.bitmap.data[i + 3] === 0) transparentCount++;
        if (img.bitmap.data[i] >= 220 && img.bitmap.data[i + 1] >= 220 && img.bitmap.data[i + 2] >= 220 && img.bitmap.data[i + 3] > 0) whiteCount++;
    }
    console.log('Transparent pixels:', transparentCount);
    console.log('White pixels:', whiteCount);
}
verify();
