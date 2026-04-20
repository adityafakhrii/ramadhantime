import jimp from 'jimp';

async function processImage() {
    const file = 'tan_dokter.png';
    console.log(`Processing ${file}...`);
    const image = await jimp.read(`./public/kids/${file}`);

    const w = image.bitmap.width;
    const h = image.bitmap.height;
    const data = image.bitmap.data;

    // Looser tolerance for off-white colors
    const isWhite = (idx) => data[idx] > 200 && data[idx + 1] > 200 && data[idx + 2] > 200 && data[idx + 3] > 0;

    // Seed points safely inside the image to bypass thin borders
    const stack = [];
    stack.push([20, 20]);
    stack.push([w - 20, 20]);
    stack.push([20, h - 20]);
    stack.push([w - 20, h - 20]);
    stack.push([Math.floor(w / 2), 20]);

    const visited = new Uint8Array(w * h);
    let removed = 0;

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        if (x < 0 || x >= w || y < 0 || y >= h) continue;

        const pos = y * w + x;
        if (visited[pos]) continue;
        visited[pos] = 1;

        const idx = pos * 4;
        if (isWhite(idx)) {
            data[idx + 3] = 0; // make transparent
            removed++;

            stack.push([x + 1, y]);
            stack.push([x - 1, y]);
            stack.push([x, y + 1]);
            stack.push([x, y - 1]);
        }
    }

    await image.writeAsync(`./public/kids/${file}`);
    console.log(`Finished ${file}. Removed ${removed} white pixels.`);
}
processImage();
