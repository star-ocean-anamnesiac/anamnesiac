
import { promises } from 'fs';
import test from 'ava';
import * as YAML from 'js-yaml';
import * as _ from 'lodash';

import { Item } from '../app/models/item';

const ROOT_FILE = 'src/assets/data/root.yml';

test('All items have valid information', async t => {
  const data = await promises.readFile(ROOT_FILE, 'utf-8');
  const { weapons, accessories } = YAML.safeLoad(data);

  const allItems = weapons.map(({ id }) => `weapon/${id}`).concat(accessories.map(({ id }) => `accessory/${id}`));
  
  await Promise.all(allItems.map(async (path) => {
    const data = await promises.readFile(`src/assets/data/item/${path}.yml`, 'utf-8');
    const items: Item[] = YAML.safeLoad(data);

    items.forEach(item => {
      const parenName = ` (${item.name})`;

      t.truthy(item.name, 'name');
      t.falsy(item.type, 'type should not be set' + parenName);
      t.falsy(item.subtype, 'subtype should not be set' + parenName);
      t.true(item.cat === 'jp' || item.cat === 'gl', 'cat must be jp or gl' + parenName);
      t.truthy(item.picture, 'must have a picture url' + parenName);
      t.true(item.star >= 0 && item.star <= 5, 'rating must be between 1 and 5' + parenName);

      t.true(item.factors.length > 0, 'item should have at least one factor' + parenName);
      t.truthy(item.obtained, 'item must mention where it is obtained' + parenName);

    });
  }));
});