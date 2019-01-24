
const packer = require('spritesheet-js');

packer('src/assets/characters/**/!(\+)*.png', { format: 'json', name: '+char-icons', path: 'src/assets/characters' }, (err) => {
  if(!err) return;
  console.error(err);
  process.exit(1);
});