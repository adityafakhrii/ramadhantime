import jimp from 'jimp';

async function processImage() {
    const file = 'tan_dokter.png';
    console.log(`Processing ${file}...`);
    const image = await jimp.read(`./public/kids/${file}`);

    const w = image.bitmap.width;
    const h = image.bitmap.height;
    const data = image.bitmap.data;

    // Looser tolerance for off-white colors
    const isWhite = (idx) => data[idx] > 220 && data[idx + 1] > 220 && data[idx + 2] > 220 && data[idx + 3] > 0;

    // Seed the stack with the ENTIRE perimeter to beat border artifacts
    const stack = [];
    for (let x = 0; x < w; x++) { stack.push([x, 0]); stack.push([x, h - 1]); }
    for (let y = 0; y < h; y++) { stack.push([0, y]); stack.push([w - 1, y]); }

    const visited = new Uint8Array(w * h);

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        if (x < 0 || x >= w || y < 0 || y >= h) continue;

        const pos = y * w + x;
        if (visited[pos]) continue;
        visited[pos] = 1;

        const idx = pos * 4;
        if (isWhite(idx)) {
            data[idx + 3] = 0; // make transparent

            stack.push([x + 1, y]);
            stack.push([x - 1, y]);
            stack.push([x, y + 1]);
            stack.push([x, y - 1]);
        }
    }

    await image.writeAsync(`./public/kids/${file}`);
    console.log(`Finished ${file}`);
}
processImage();
