
const exec = require('child_process').execSync;
const fs = require('fs');

const packer = require('spritesheet-js');
const rimraf = require('rimraf');

// clean directory in case it needs it
rimraf.sync('src/assets/rush/\+*');

// transform these files to the correct dimensions
exec('gm mogrify -format "formatted.png" -trim -resize 64x64! "src/assets/rush/*.png"');

// pack textures
packer(
  'src/assets/rush/**/*.formatted.png', 

  { format: 'json', name: '+rush-icons', path: 'src/assets/rush' }, 

  (err) => {
    if(!err) {

      // rewrite atlas file
      fs.writeFileSync(
        'src/assets/rush/+rush-icons.json',
        fs.readFileSync('src/assets/rush/+rush-icons.json', 'utf-8').split('.formatted').join('')
      );

      // remove formatted images
      rimraf.sync('src/assets/rush/**/*.formatted.png');
      return;
    }
    
    console.error(err);
    process.exit(1);
  }
);