
import * as fs from 'fs';
import test from 'ava';
import * as YAML from 'js-yaml';
import * as _ from 'lodash';

import { BossGuide } from '../app/models/bossguide';

test('All boss guides have valid information', t => {

  fs.readdirSync('src/assets/data/bossguides').forEach(file => {
    const guides = fs.readFileSync(`src/assets/data/bossguides/${file}`, 'utf-8');
    const guideDatas: BossGuide[] = YAML.safeLoad(guides);

    guideDatas.forEach(guide => {
      const parenName = ` (${guide.name})`;

      t.truthy(guide.name, 'name must be set' + parenName);
      t.truthy(guide.image, 'image must be set' + parenName);
      t.true(fs.existsSync(`src/assets/bosses/boss_${guide.image}.png`), 'guide must reference a valid image' + parenName);
      t.true(guide.cat === 'jp' || guide.cat === 'gl', 'cat must be jp or gl' + parenName);
      t.truthy(guide.race, 'race must be set' + parenName);
      
      t.true(guide.isActive === false || guide.isActive === true, 'guide.isActive must be set to true or false' + parenName);

      t.truthy(guide.enrage, 'enrage must be set' + parenName);
      t.truthy(guide.enrage.m1, 'enrage.m1 must be set' + parenName);

      t.truthy(guide.desc, 'desc must be set' + parenName);

      guide.weaknesses.forEach(weakness => {
        t.truthy(weakness.plain || weakness.element || weakness.status, 'weakness.plain, weakness.element or weakness.status must be set' + parenName);

        if(weakness.element) {
          t.truthy(weakness.percentWeakness, 'weakness.percentWeakness must be set if element is set' + parenName);
        }

        if(weakness.status) {
          t.truthy(weakness.vuln, 'weakness.vuln must be set if status is set' + parenName);
        }
      });

      guide.moves.forEach(move => {
        t.truthy(move.name, 'move.name must be set' + parenName);
        t.truthy(move.desc, 'move.desc must be set' + parenName + '->' + move.name);
      });

      guide.recommendations.forEach(rec => {
        t.truthy(rec.plain || rec.unit, 'recommendation.unit or recommendation.plain must be set' + parenName);
      });
    });
  });

});
