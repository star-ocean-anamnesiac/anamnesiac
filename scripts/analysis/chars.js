
const YAML = require('js-yaml');
const fs = require('fs');
const { difference } = require('lodash');

const ROOT_FILE = 'src/assets/data/root.yml';
const data = fs.readFileSync(ROOT_FILE, 'utf-8');
const { classes, weapons } = YAML.safeLoad(data);

const glChars = [];
const jpChars = [];

classes.forEach(charClass => {
  const datagl = fs.readFileSync(`src/assets/data/character/${charClass.toLowerCase()}.yml`, 'utf-8');
  const charactersgl = YAML.safeLoad(datagl);
  
  const datajp = fs.readFileSync(`src/assets/data/character/${charClass.toLowerCase()}.jp.yml`, 'utf-8');
  const charactersjp = YAML.safeLoad(datajp);

  charactersgl.forEach(char => glChars.push(char.name));
  charactersjp.forEach(char => jpChars.push(char.name));
});

console.log();
console.log('GL Characters Not In JP:', JSON.stringify(difference(glChars, jpChars)));
console.log();
console.log('JP Characters Not In GL:', JSON.stringify(difference(jpChars, glChars)));
console.log();