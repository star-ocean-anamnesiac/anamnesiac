
const rimraf = require('rimraf');

rimraf.sync('www/characters');

rimraf.sync('www/assets/data');

rimraf.sync('www/assets/icons/**/*.png');
rimraf.sync('www/assets/items/**/*.png');

console.log('Cleanup done.');
