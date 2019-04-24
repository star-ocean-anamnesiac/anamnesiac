
import { includes } from 'lodash';

const validMetas = [
  'ATK', 'INT', 'DEF', 'GRD', 'HIT', 'HP',

  'AP Recovery', 'AP Recovery From Normal Attacks', 'AP Cost Reduction', 'AP Cost Increase',

  'Elemental Damage', 
  
  'Fire Damage', 'Ice Damage', 'Light Damage', 
  'Dark Damage', 'Earth Damage', 'Lightning Damage', 'Wind Damage',

  'Fire Damage Reduction', 'Ice Damage Reduction', 'Light Damage Reduction', 'Dark Damage Reduction',
  'Earth Damage Reduction', 'Lightning Damage Reduction', 'Wind Damage Reduction',

  'Crit Rate', 'Crit Damage',

  'Damage To Humans', 'Damage To Beasts', 'Damage To Machines', 'Damage To Demons', 
  'Damage To Divinities', 'Damage To Plants', 'Damage To Birds', 'Damage To Dragons',
  'Damage To Insects', 'Damage To Undead',

  'Stun Rate',

  'Damage', 'INT Damage', 'ATK Damage',
  'Damage Taken Reduction', 'INT Damage Taken Reduction', 'ATK Damage Taken Reduction',

  'Rush Damage',

  'Single Target Damage', 'Multiple Target Damage',

  'Silence Attack Chance', 'Poison Attack Chance', 'Curse Attack Chance', 
  'Paralysis Attack Chance', 'Freeze Attack Chance',

  'Cast Time Reduction',
  
  'Enemy Damage Taken', 'Enemy ATK Damage Taken', 'Enemy INT Damage Taken',

  'DEF Reduction', 'ATK Reduction', 'INT Reduction', 'HIT Reduction', 'GRD Reduction',
  'Enemy DEF Reduction', 'Enemy ATK Reduction', 'Enemy INT Reduction', 'Enemy HIT Reduction', 'Enemy GRD Reduction',
  
  'INT -> ATK', 'ATK -> INT'
];

export const validateMeta = (t, meta, parenName) => {
  if(!meta) return;

  if(meta.buffs) {
    t.true(meta.buffs.length > 0, 'meta buffs must exist' + parenName);
    meta.buffs.forEach(buff => {
      t.true(includes(validMetas, buff), 'meta (' + buff + ') must be a valid buff ' + parenName);
    });
  } else {
    t.truthy(meta.buff, 'meta (' + meta.buff + ') must have a buff or buffs' + parenName);
    t.true(includes(validMetas, meta.buff), 'meta (' + meta.buff + ') must be a valid buff' + parenName);
  }
  
  t.true(meta.buffValue > 0, 'meta  must have a value > 0' + parenName);
  t.true(meta.priority > 0 && meta.priority < 5, 'meta must have a priority 1..4' + parenName);

  t.falsy(meta.source, 'meta source should not be set' + parenName);
  t.falsy(meta.sourceCharacter, 'meta sourceCharacter should not be set' + parenName);
  t.falsy(meta.sourceImage, 'meta sourceImage should not be set' + parenName);
};
