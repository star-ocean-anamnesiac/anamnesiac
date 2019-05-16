
const exec = require('child_process').execSync;
const fs = require('fs');

const packer = require('spritesheet-js');
const rimraf = require('rimraf');

// clean directory in case it needs it
rimraf.sync('src/assets/items/\+*');

// transform these files to the correct dimensions
fs.readdirSync('src/assets/items/').filter((file) => {
  if(!fs.statSync('src/assets/items/' + file).isDirectory()) return;
  exec('gm mogrify -format "formatted.png" -trim -resize 64x64! "src/assets/items/' + file + '/*.png"');
});

// pack textures
packer(
  'src/assets/items/**/*.formatted.png', 

  { format: 'json', name: '+item-icons', path: 'src/assets/items' }, 

  (err) => {
    if(!err) {

      // rewrite atlas file
      fs.writeFileSync(
        'src/assets/items/+item-icons.json',
        fs.readFileSync('src/assets/items/+item-icons.json', 'utf-8').split('.formatted').join('')
      );

      // remove formatted images
      rimraf.sync('src/assets/items/**/*.formatted.png');
      return;
    }
    
    console.error(err);
    process.exit(1);
  }
);