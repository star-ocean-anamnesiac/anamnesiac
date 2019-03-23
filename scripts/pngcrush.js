
const imagemin = require('imagemin');
const pngquant = require('imagemin-pngquant');
const webp = require('imagemin-webp');

const init = async () => {
  await imagemin([
    'src/assets/**/*-icons.png'
  ], 'src/assets/spritesheets', {
    plugins: [
      pngquant({ 
        quality: [0.1, 0.2] 
      })
    ]
  });

  await imagemin([
    'src/assets/spritesheets/*.png'
  ], 'src/assets/spritesheets', {
    plugins: [
      webp({
        quality: 40
      })
    ]
  });

  await imagemin([
    'src/assets/cards/*.png'
  ], 'src/assets/cards', {
    plugins: [
      webp({
        lossless: true
      })
    ]
  });

  console.log('Done compressing images.');

};

init();