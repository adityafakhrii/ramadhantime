import fs from 'fs';
const b192 = "iVBORw0KGgoAAAANSUhEUgAAAMAAAADAAQMAAAA1O/R+AAAAA1BMVEUufTItn7a7AAAAFklEQVR4AWMYBYOAsQAxAwD7CgAAAAAA/wEAAeXzVbEAAAAASUVORK5CYII=";
fs.writeFileSync('public/pwa-192x192.png', Buffer.from(b192, 'base64'));
const b512 = "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAADOtka5AAAAA1BMVEUufTItn7a7AAAAKklEQVR4AWMYBYOAsQAxAwD7CgAAAAAA/wEAAeXzVbEAAAAASUVORK5CYII=";
fs.writeFileSync('public/pwa-512x512.png', Buffer.from(b512, 'base64'));
console.log('Icons generated.');
