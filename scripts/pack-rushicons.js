
const packer = require('spritesheet-js');

packer('src/assets/rush/**/!(\+)*.png', { format: 'json', name: '+rush-icons', path: 'src/assets/rush' }, (err) => {
  if(!err) return;
  console.error(err);
  process.exit(1);
});