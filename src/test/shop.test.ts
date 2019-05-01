
import * as fs from 'fs';
import test from 'ava';
import * as YAML from 'js-yaml';
import * as _ from 'lodash';

import { Shop } from '../app/models/shop';

test('All shops have valid information', t => {

  fs.readdirSync('src/assets/data/shops').forEach(file => {
    const shops = fs.readFileSync(`src/assets/data/shops/${file}`, 'utf-8');
    const shopDatas: Shop[] = YAML.safeLoad(shops);

    shopDatas.forEach(shop => {
      const parenName = ` (${shop.name})`;

      t.truthy(shop.name, 'shop must have a name' + parenName);
      t.truthy(shop.currency, 'shop must have a currency' + parenName);
      t.truthy(shop.icon, 'shop must have an icon' + parenName);
      t.true(shop.aliases && shop.aliases.length > 0, 'shop must have aliases' + parenName);
      t.true(shop.cat === 'gl' || shop.cat === 'jp', 'shop cat must be gl or jp' + parenName);

      t.true(shop.items && shop.items.length > 0, 'shop must have items' + parenName);

      shop.items.forEach(item => {
        t.truthy(item.name, 'item.name must exist' + parenName);
        t.true(item.cost > 0, 'item.cost must be > 0' + parenName);
        t.truthy(item.type, 'item must have a valid type icon' + parenName);
        if(item.stock) {
          t.true(_.isNumber(item.stock), 'item.stock must be a number if it exists' + parenName);
        }
      });
    });
  });

});
