
const packer = require('spritesheet-js');
const rimraf = require('rimraf');

// clean directory in case it needs it
rimraf.sync('src/assets/characters/\+*');

exec('gm mogrify -format "formatted.png" -trim -resize 128x128! "src/assets/characters/*.png"');

packer(
  'src/assets/characters/**/*.formatted.png', 

  { format: 'json', name: '+char-icons', path: 'src/assets/characters' }, 
  
  (err) => {
    if(!err) {

      // rewrite atlas file
      fs.writeFileSync(
        'src/assets/character/+char-icons.json',
        fs.readFileSync('src/assets/characters/+char-icons.json', 'utf-8').split('.formatted').join('')
      );

      // remove formatted images
      rimraf.sync('src/assets/characters/**/*.formatted.png');
      return;
    }

    console.error(err);
    process.exit(1);
  });