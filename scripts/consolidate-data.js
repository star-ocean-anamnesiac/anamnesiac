
const _ = require('lodash');

const YAML = require('js-yaml');
const fs = require('fs');

const ROOT_FILE = 'src/assets/data/root.yml';
const CHANGELOG_FILE = 'src/assets/data/changelog.yml';
const BOSSGUIDE_FOLDER = 'src/assets/data/bossguides';

const data = fs.readFileSync(ROOT_FILE, 'utf-8');
const changelogData = fs.readFileSync(CHANGELOG_FILE, 'utf-8');

const root = YAML.safeLoad(data);
const changelog = YAML.safeLoad(changelogData);

const { classes, weapons, accessories } = root;

const allItems = _.flattenDeep(weapons.concat(accessories).map(({ id }) => {
  const path = id === 'all' ? `accessory/all` : `weapon/${id}`;

  const datagl = fs.readFileSync(`src/assets/data/item/${path}.yml`, 'utf-8');
  const itemsgl = YAML.safeLoad(datagl);
  
  const datajp = fs.readFileSync(`src/assets/data/item/${path}.jp.yml`, 'utf-8');
  const itemsjp = YAML.safeLoad(datajp);

  const items = itemsgl.concat(itemsjp);

  items.forEach(item => {
    item.type = id === 'all' ? 'accessory' : 'weapon';
    item.subtype = id;
  });

  return items;
}));

const allCharacters = _.flattenDeep(classes.map(charClass => {
  const datagl = fs.readFileSync(`src/assets/data/character/${charClass.toLowerCase()}.yml`, 'utf-8');
  const charactersgl = YAML.safeLoad(datagl);

  const datajp = fs.readFileSync(`src/assets/data/character/${charClass.toLowerCase()}.jp.yml`, 'utf-8');
  const charactersjp = YAML.safeLoad(datajp);

  const characters = charactersgl.concat(charactersjp);

  characters.forEach(char => char.type = charClass.toLowerCase());

  return characters;
}));

const allGuides = _.flattenDeep(fs.readdirSync(BOSSGUIDE_FOLDER).map(file => {
  const data = fs.readFileSync(`${BOSSGUIDE_FOLDER}/${file}`, 'utf-8');
  const bossguides = YAML.safeLoad(data);

  return bossguides;
}));

const fullData = {
  root,
  changelog,
  allCharacters,
  allItems,
  allGuides
};

fs.writeFileSync('src/app/data.json', JSON.stringify(fullData));

