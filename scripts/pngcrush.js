
const imagemin = require('imagemin');
const pngquant = require('imagemin-pngquant');

imagemin([
  'src/assets/**/*-icons.png'
], 'src/assets/spritesheets', {
  plugins: [pngquant({ quality: [0.1, 0.3] })]
}).then(() => {
  console.log('PNGCrush done.');
});