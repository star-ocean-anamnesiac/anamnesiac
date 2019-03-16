
const imagemin = require('imagemin');
const pngquant = require('imagemin-pngquant');
const webp = require('imagemin-webp');

imagemin([
  'src/assets/**/*-icons.png'
], 'src/assets/spritesheets', {
  plugins: [
    pngquant({ 
      quality: [0.1, 0.2] 
    })
  ]
}).then(() => {
  return imagemin([
    'src/assets/spritesheets/*.png'
  ], 'src/assets/spritesheets', {
    plugins: [
      webp({
        quality: 40
      })
    ]
  })
}).then(() => {
  console.log('PNGCrush done.');
});