
const rimraf = require('rimraf');

rimraf('www/characters');

rimraf('www/assets/data', () => {});

rimraf('www/assets/icons/**/*.png', () => {});
rimraf('www/assets/items/**/*.png', () => {});
