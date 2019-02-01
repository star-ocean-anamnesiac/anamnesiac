
const packer = require('spritesheet-js');

packer('src/assets/skills/**/!(\+)*.png', { format: 'json', name: '+skill-icons', path: 'src/assets/skills' }, (err) => {
  if(!err) return;
  console.error(err);
  process.exit(1);
});