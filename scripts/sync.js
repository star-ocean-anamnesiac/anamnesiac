
const SERVICE_EMAIL = process.env.SERVICE_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SPREADSHEET_KEY = process.env.SPREADSHEET_KEY;
const REGION = process.env.REGION || 'jp';

if(!SERVICE_EMAIL || !PRIVATE_KEY || !SPREADSHEET_KEY) process.exit(0);

const { interval } = require('rxjs');
const { map } = require('rxjs/operators');
const fs = require('fs');
const _ = require('lodash');
const YAML = require('js-yaml');
const Promise = require('bluebird');
const GoogleSpreadsheet = require('google-spreadsheet');

const cellUpdates = [];

const updateCell = (cells, pos, value) => {
  cells[pos].value = value;
  cellUpdates.push(cells[pos]);
};

const doUpdates = async (doc, worksheets) => {
  let updateSheet = _.find(worksheets, { title: 'Updates' });
  if(!updateSheet) updateSheet = await doc.addWorksheetAsync({ title: 'Updates' });

  const updateSheetIndex = _.findIndex(worksheets, { title: 'Updates' }) + 1;

  const updates = YAML.safeLoad(fs.readFileSync(__dirname + '/../src/assets/data/changelog.yml'));
  const cells = await doc.getCellsAsync(updateSheetIndex, {
    'min-row': 2,
    'max-row': 2 + updates.length,
    'min-col': 2,
    'max-col': 3,
    'return-empty': true
  });

  const formatUpdate = (update) => {
    return _.compact([
      update.characterAdditions ? 'New Characters: ' + update.characterAdditions.map(x => `${x.name} (${x.notes})`).join(', ') : '',
      update.characterChanges ? 'Character Changes: ' + update.characterChanges.map(x => `${x.name} (${x.notes})`).join(', ') : '',
      update.itemAdditions ? 'New Items: ' + update.itemAdditions.map(x => `${x.name} (${x.notes})`).join(', ') : '',
      update.itemChanges ? 'Item Changes: ' + update.itemChanges.map(x => `${x.name} (${x.notes})`).join(', ') : ''
    ]).join('\n\n');
  };

  updates.forEach((update, i) => {
    updateCell(cells, i * 2, new Date(update.date).toDateString());
    updateCell(cells, (i * 2) + 1, formatUpdate(update));
  });

};

const updateCharacters = async (doc, worksheets, data) => {

  const allWeaponClasses = {};
  data.weapons.forEach(({ id, name }) => allWeaponClasses[id] = name);

  for(charClass of data.classes) {
    let updateSheet = _.find(worksheets, { title: charClass });
    if(!updateSheet) updateSheet = await doc.addWorksheetAsync({ title: charClass });

    const updateSheetIndex = _.findIndex(worksheets, { title: charClass }) + 1;

    const characters = YAML.safeLoad(fs.readFileSync(__dirname + `/../src/assets/data/character/${charClass.toLowerCase()}.yml`));
    const filteredChars = characters.filter(char => char.cat === REGION);

    const totalRows = 3 + (3 + (filteredChars.length * 2));

    await updateSheet.resize({ rowCount: totalRows, colCount: 6 });

    const cells = await doc.getCellsAsync(updateSheetIndex, {
      'min-row': 3,
      'max-row': totalRows,
      'min-col': 1,
      'max-col': 6,
      'return-empty': true
    });

    const allTalents = (char) => {
      return _.flatten(char.talents.map(talent => talent.effects.map(x => {
        return `${x.desc} ${x.all ? (x.all === true ? '(All Allies)' : `(All ${x.all})`) : ''}`;
      }))).join('\n');
    };

    const rush = (char) => {
      return [
        char.rush.power + (char.rush.element ? ` (${char.rush.element})` : ''),
        ...char.rush.effects.map(x => {
          return `${x.desc} ${x.all ? (x.all === true ? '(All Allies)' : `(All ${x.all})`) : ''}`;
        })
      ].join('\n')
    };

    const skill = (char, idx) => {
      const skill = char.skills[idx];
      return [
        `${skill.name} (${skill.ap} AP)`,
        skill.power
      ].join('\n');
    };

    filteredChars.forEach((char, i) => {
      updateCell(cells, i * 12, `=IMAGE("https://anamnesiac.seiyria.com/assets/characters/${char.picture.split(' ').join('%20')}.png", 4, 128, 128)`);
      updateCell(cells, (i * 12) + 1, `${char.name}\n\n${char.rating}/10\n\n${char.limited ? 'Limited' : 'Permanent'}\n\n${char.ace ? 'ACE' : ''}`);
      updateCell(cells, (i * 12) + 2, allWeaponClasses[char.weapon]);
      updateCell(cells, (i * 12) + 3, allTalents(char));
      updateCell(cells, (i * 12) + 4, rush(char));
      updateCell(cells, (i * 12) + 5, char.notes);
      updateCell(cells, (i * 12) + 6, '');
      updateCell(cells, (i * 12) + 7, skill(char, 0));
      updateCell(cells, (i * 12) + 8, skill(char, 1));
      updateCell(cells, (i * 12) + 9, skill(char, 2));
      updateCell(cells, (i * 12) + 10, skill(char, 3));
    });
  };
};

const updateItems = async (doc, worksheets, data) => {

  data.weapons.push({ id: 'all', name: 'Accessory' });

  for(weaponInfo of data.weapons) {
    const weaponClass = weaponInfo.id;
    const weaponName = weaponInfo.name.split('&').join('\'n\'');

    let updateSheet = _.find(worksheets, { title: weaponName });
    if(!updateSheet) updateSheet = await doc.addWorksheetAsync({ title: weaponName });

    const updateSheetIndex = _.findIndex(worksheets, { title: weaponName }) + 1;

    const type = weaponName === 'Accessory' ? 'accessory' : 'weapon';
    const items = YAML.safeLoad(fs.readFileSync(__dirname + `/../src/assets/data/item/${type}/${weaponClass.toLowerCase()}.yml`));
    const filteredItems = items.filter(item => item.cat === REGION);

    const totalRows = 3 + (3 + (filteredItems.length));

    await updateSheet.resize({ rowCount: totalRows, colCount: 9 });

    const cells = await doc.getCellsAsync(updateSheetIndex, {
      'min-row': 3,
      'max-row': totalRows,
      'min-col': 1,
      'max-col': 9,
      'return-empty': true
    });

    filteredItems.forEach((item, i) => {
      updateCell(cells, i * 9, `=IMAGE("https://anamnesiac.seiyria.com/assets/items/${item.picture.split(' ').join('%20')}.png", 4, 128, 128)`);
      updateCell(cells, (i * 9) + 1, `${item.name}\n\n${item.obtained}`);
      updateCell(cells, (i * 9) + 2, item.atk);
      updateCell(cells, (i * 9) + 3, item.int);
      updateCell(cells, (i * 9) + 4, item.factor1);
      updateCell(cells, (i * 9) + 5, item.factor2);
      updateCell(cells, (i * 9) + 6, item.factor3);
      updateCell(cells, (i * 9) + 7, item.thirdFactorLB);
      updateCell(cells, (i * 9) + 8, item.notes);
    });
  };
};

const syncData = async () => {

  const doc = Promise.promisifyAll(new GoogleSpreadsheet(SPREADSHEET_KEY));

  await doc.useServiceAccountAuthAsync({ client_email: SERVICE_EMAIL, private_key: PRIVATE_KEY });
  const { worksheets } = await doc.getInfoAsync();
  const rootData = YAML.safeLoad(fs.readFileSync(__dirname + '/../src/assets/data/root.yml'));

  await doUpdates(doc, worksheets);
  await updateCharacters(doc, worksheets, rootData);
  await updateItems(doc, worksheets, rootData);

  interval(150).pipe(map(x => cellUpdates[x])).subscribe(cell => {
    if(!cell) process.exit(0);
    cell.save();
  });
};

syncData();
