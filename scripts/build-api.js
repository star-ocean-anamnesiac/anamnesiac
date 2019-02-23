
const fs = require('fs');

fs.copyFileSync('src/app/data.json', 'www/data.json');
fs.writeFileSync('www/_headers', `/*\r\n\tX-Commit: ${process.env.COMMIT_REF}`);

console.log('Headers built.');