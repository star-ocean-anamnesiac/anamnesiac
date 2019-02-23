
const fs = require('fs');
const rimraf = require('rimraf');

rimraf.sync('www/characters');

rimraf.sync('www/assets/data');

rimraf.sync('www/assets/icons/**/*.png');
rimraf.sync('www/assets/items/**/*.png');

fs.copyFileSync('src/app/data.json', 'www/assets/data.json');
