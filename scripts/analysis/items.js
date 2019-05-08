
const YAML = require('js-yaml');
const fs = require('fs');
const { difference } = require('lodash');

const ROOT_FILE = 'src/assets/data/root.yml';
const data = fs.readFileSync(ROOT_FILE, 'utf-8');
const { weapons, accessories } = YAML.safeLoad(data);

const allItems = weapons.concat(accessories);

const glItems = [];
const jpItems = [];

allItems.forEach(({ id }) => {
  const type = id === 'all' ? 'accessory' : 'weapon';

  const datagl = fs.readFileSync(`src/assets/data/item/${type}/${id}.yml`, 'utf-8');
  const itemsgl = YAML.safeLoad(datagl);

  const datajp = fs.readFileSync(`src/assets/data/item/${type}/${id}.jp.yml`, 'utf-8');
  const itemsjp = YAML.safeLoad(datajp);

  itemsgl.forEach(item => glItems.push(item.name));
  itemsjp.forEach(item => jpItems.push(item.name));
});

console.log();
console.log('GL Items Not In JP:', JSON.stringify(difference(glItems, jpItems)));
console.log();
console.log('JP Items Not In GL:', JSON.stringify(difference(jpItems, glItems)));
console.log();