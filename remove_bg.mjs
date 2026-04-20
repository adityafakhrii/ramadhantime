import jimp from 'jimp';
import fs from 'fs';

const files = fs.readdirSync('./public/kids').filter(f => f.endsWith('.png') && !f.startsWith('bg_'));

async function processImages() {
    for (const file of files) {
        console.log(`Processing ${file}...`);
        const image = await jimp.read(`./public/kids/${file}`);

        const w = image.bitmap.width;
        const h = image.bitmap.height;
        const data = image.bitmap.data;

        // Tolerance for off-white compression artifacts
        const isWhite = (idx) => data[idx] > 230 && data[idx + 1] > 230 && data[idx + 2] > 230 && data[idx + 3] > 0;

        const stack = [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]]; // start from corners
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
}
processImages();
