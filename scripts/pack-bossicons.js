
const exec = require('child_process').execSync;
const fs = require('fs');

const packer = require('spritesheet-js');
const rimraf = require('rimraf');

// clean directory in case it needs it
rimraf.sync('src/assets/bosses/\+*');

// transform these files to the correct dimensions
exec('gm mogrify -format "formatted.png" -trim -resize 64x64! "src/assets/bosses/*.png"');

// pack textures
packer(
  'src/assets/bosses/**/*.formatted.png', 

  { format: 'json', name: '+boss-icons', path: 'src/assets/bosses' }, 

  (err) => {
    if(!err) {

      // rewrite atlas file
      fs.writeFileSync(
        'src/assets/bosses/+boss-icons.json',
        fs.readFileSync('src/assets/bosses/+boss-icons.json', 'utf-8').split('.formatted').join('')
      );

      // remove formatted images
      rimraf.sync('src/assets/bosses/**/*.formatted.png');
      return;
    }
    
    console.error(err);
    process.exit(1);
  }
);