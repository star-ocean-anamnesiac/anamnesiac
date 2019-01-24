
const packer = require('spritesheet-js');

packer('src/assets/icons/**/!(\+)*.png', { format: 'json', name: '+app-icons', path: 'src/assets/icons' }, (err) => {
  if(!err) return;
  console.error(err);
  process.exit(1);
});