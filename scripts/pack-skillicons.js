
const exec = require('child_process').execSync;
const fs = require('fs');

const packer = require('spritesheet-js');
const rimraf = require('rimraf');

// clean directory in case it needs it
rimraf.sync('src/assets/skills/\+*');

// transform these files to the correct dimensions
exec('gm mogrify -format "formatted.png" -trim -resize 64x64! "src/assets/skills/*.png"');

// pack textures
packer(
  'src/assets/skills/**/*.formatted.png', 

  { format: 'json', name: '+skill-icons', path: 'src/assets/skills' }, 

  (err) => {
    if(!err) {

      // rewrite atlas file
      fs.writeFileSync(
        'src/assets/skills/+skill-icons.json',
        fs.readFileSync('src/assets/skills/+skill-icons.json', 'utf-8').split('.formatted').join('')
      );

      // remove formatted images
      rimraf.sync('src/assets/skills/**/*.formatted.png');
      return;
    }
    
    console.error(err);
    process.exit(1);
  }
);