
const packer = require('spritesheet-js');

packer('src/assets/items/**/!(\+)*.png', { format: 'json', name: '+item-icons', path: 'src/assets/items' }, (err) => {
  if(!err) return;
  console.error(err);
  process.exit(1);
});