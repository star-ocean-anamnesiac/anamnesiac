
const exec = require('child_process').execSync;

// transform these files to the correct dimensions
exec('gm mogrify -trim -resize 64x64! "src/assets/skills/*.png"');
exec('gm mogrify -trim -resize 64x64! "src/assets/rush/*.png"');