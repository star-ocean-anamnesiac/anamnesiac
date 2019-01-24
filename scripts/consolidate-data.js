
const _ = require('lodash');

const YAML = require('js-yaml');
const fs = require('fs');

const ROOT_FILE = 'src/assets/data/root.yml';
const CHANGELOG_FILE = 'src/assets/data/changelog.yml';

const data = fs.readFileSync(ROOT_FILE, 'utf-8');
const changelogData = fs.readFileSync(CHANGELOG_FILE, 'utf-8');

const root = YAML.safeLoad(data);
const changelog = YAML.safeLoad(changelogData);

const { classes, weapons, accessories } = root;

const allItems = _.flattenDeep(weapons.concat(accessories).map(({ id }) => {
  const path = id === 'all' ? `accessory/all` : `weapon/${id}`;
  const data = fs.readFileSync(`src/assets/data/item/${path}.yml`, 'utf-8');
  const items = YAML.safeLoad(data);

  items.forEach(item => {
    item.type = id === 'all' ? 'accessory' : 'weapon';
    item.subtype = id;
  });

  return items;
}));

const allCharacters = _.flattenDeep(classes.map(charClass => {
  const data = fs.readFileSync(`src/assets/data/character/${charClass.toLowerCase()}.yml`, 'utf-8');
  const characters = YAML.safeLoad(data);

  characters.forEach(char => char.type = charClass.toLowerCase());

  return characters;
}));

const fullData = {
  root,
  changelog,
  allCharacters,
  allItems
};

fs.writeFileSync('src/app/data.json', JSON.stringify(fullData));

