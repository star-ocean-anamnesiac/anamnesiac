
const _ = require('lodash');

const YAML = require('js-yaml');
const { promises } = require('fs');

const ROOT_FILE = 'src/assets/data/root.yml';
const CHANGELOG_FILE = 'src/assets/data/changelog.yml';

const run = async () => {
  const data = await promises.readFile(ROOT_FILE, 'utf-8');
  const changelogData = await promises.readFile(CHANGELOG_FILE, 'utf-8');
  
  const root = YAML.safeLoad(data);
  const changelog = YAML.safeLoad(changelogData);

  const { classes, weapons, accessories } = root;
  
  const allItems = _.flattenDeep(await Promise.all(weapons.concat(accessories).map(async ({ id }) => {
    const path = id === 'all' ? `accessory/all` : `weapon/${id}`;
    const data = await promises.readFile(`src/assets/data/item/${path}.yml`, 'utf-8');
    const items = YAML.safeLoad(data);

    if(id === 'all') {
      accessories.forEach(weap => {
        weap.type = 'accessory';
        weap.subtype = id;
      });
    } else {
      items.forEach(item => {
        item.type = 'weapon';
        item.subtype = id;
      });
    }

    return items;
  })));

  const allCharacters = _.flattenDeep(await Promise.all(classes.map(async charClass => {
    const data = await promises.readFile(`src/assets/data/character/${charClass.toLowerCase()}.yml`, 'utf-8');
    const characters = YAML.safeLoad(data);

    characters.forEach(char => char.type = charClass.toLowerCase());

    return characters;
  })));

  const fullData = {
    root,
    changelog,
    allCharacters,
    allItems
  };

  await promises.writeFile('src/app/data.json', JSON.stringify(fullData));
};

run();