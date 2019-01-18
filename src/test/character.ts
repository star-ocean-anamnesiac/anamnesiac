
import { promises } from 'fs';
import test from 'ava';
import * as YAML from 'js-yaml';
import * as _ from 'lodash';

import { Character } from '../app/models/character';

const ROOT_FILE = 'src/assets/data/root.yml';

test('All characters have valid information', async t => {
  const data = await promises.readFile(ROOT_FILE, 'utf-8');
  const { classes, weapons } = YAML.safeLoad(data);

  const weaponHash = weapons.reduce((prev, cur) => {
    prev[cur.id] = true;
    return prev;
  }, {});
  
  console.log('Valid Weapon Types: ', weapons.map(x => x.id).join(', '), weaponHash);
  
  await Promise.all(classes.map(async charClass => {
    const data = await promises.readFile(`src/assets/data/character/${charClass.toLowerCase()}.yml`, 'utf-8');
    const characters: Character[] = YAML.safeLoad(data);

    characters.forEach(char => {
      const parenName = ` (${char.name})`;

      t.truthy(char.name, 'name');
      t.falsy(char.type, 'type should not be set' + parenName);
      t.true(char.cat === 'jp' || char.cat === 'gl', 'cat must be jp or gl' + parenName);
      t.true(char.rating >= 0 && char.rating <= 10, 'rating must be between 0 and 10' + parenName);
      t.truthy(char.picture, 'must have a picture url' + parenName);
      t.truthy(weaponHash[char.weapon], `char must have a valid weapon type (${char.weapon} is invalid)` + parenName);
      t.true(char.star >= 3 && char.star <= 5, 'star level must be between 3 and 5' + parenName);
      t.true(_.isNumber(char.stats.atk), 'stats.atk must be a number' + parenName);
      t.true(_.isNumber(char.stats.int), 'stats.int must be a number' + parenName);
      t.true(_.isNumber(char.stats.def), 'stats.def must be a number' + parenName);
      t.true(_.isNumber(char.stats.hit), 'stats.hit must be a number' + parenName);
      t.true(_.isNumber(char.stats.grd), 'stats.grd must be a number' + parenName);
      t.true(_.isNumber(char.stats.hp), 'stats.hp must be a number' + parenName);

      char.talents.forEach(talent => {
        t.truthy(talent.name, 'talents must have a name' + parenName);

        talent.effects.forEach(eff => {
          t.truthy(eff.desc, 'talent.effect must have a desc' + parenName);
          if(eff.duration) {
            t.true(_.isNumber(eff.duration), 'talent.effect.duration must be a number' + parenName);
          }
        });
      });

      char.skills.forEach(skill => {
        t.truthy(skill.name, 'skill.name must exist' + parenName);
        if(skill.maxHits) t.truthy(skill.power, 'skill.power must exist if it skill.maxHits exists' + parenName);
        t.truthy(skill.ap, 'skill.ap must exist' + parenName);
      });

      t.truthy(char.rush.name, 'rush.name must exist' + parenName);
      t.truthy(char.rush.power, 'rush.power must exist' + parenName);
      t.truthy(char.rush.maxHits, 'rush.maxHits must exist' + parenName);
    });
  }));
});
