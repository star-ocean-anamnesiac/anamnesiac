
const fs = require('fs');
const base64 = require('base64-img');

const baseHTML = fs.readFileSync(__dirname + '/base.html', 'utf-8');
const APP_BASE = '../../src/app';
const ASSET_BASE = `../../src/assets`;
const { allCharacters } = require(`${APP_BASE}/data.json`);

const numberCircles = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];

const inlinedFiles = {};

const inlineImg = (imgPath) => {
  if(inlinedFiles[imgPath]) return inlinedFiles[imgPath];
  const res = base64.base64Sync(__dirname + '/' + imgPath);
  inlinedFiles[imgPath] = res;
  return res;
};

const helpers = {
  calcMaxLevelFromRating(star) {
    return star >= 4 ? 70 : 60;
  },

  calcMaxLimitBreakFromRating(star) {
    if(star === 3) return 3;
    if(star === 4) return 5;
    return 10;
  },

  effectString(rush) {
    if(rush.shortEffects) return rush.shortEffects;
    
    const effArr = rush.effects;

    const effects = effArr.map(x => {
      const base = x.desc;
      if(x.all) {
        return `${base} (${x.all === true ? 'All Party' : 'All ' + x.all })`;
      }
      return base;
    })
    return effects.join(', ');
  }
};

const allCharHTML = allCharacters.map(char => {
  return `
<div class="char-card" data-character="${char.picture}-${char.awakened ? 'a-' : ''}${char.cat}">

  <img class="char-sprite" src="${inlineImg(`${ ASSET_BASE }/characters/${ char.picture }.png`)}">

  <div class="char-tag gradient-${ char.type }">
    <img class="char-class-icon" src="${inlineImg(`${ ASSET_BASE }/icons/charclass/class-${ char.type }.png`)}">

    <span class="char-name">${ char.name }</span>

    <img class="char-class-icon item" src="${inlineImg(`${ ASSET_BASE }/icons/menu/menu-${ char.weapon }.png`)}">
  </div>

  <div class="char-region">
    ${ char.cat }
  </div>

  <div class="rush">
    <div class="rush-name">
      <img class="skill-element" src="${inlineImg(`${ ASSET_BASE }/icons/element/el-${ (char.rush.element || 'none').toLowerCase() }.png`)}">
      Rush Mode: ${ char.rush.name }
    </div>
    <div class="rush-desc">
      ${ helpers.effectString(char.rush) }
    </div>
    <div class="rush-power">
      Power: ${ char.rush.power } / Hits: ${ char.rush.maxHits }
    </div>
  </div>

  <div class="char-bottom-border"></div>

  <div class="char-skills">
    ${
      char.skills.map((skill, i) => {
        return `
          <div class="char-skill">
            <div class="char-skill-left">
              <img class="skill-element" src="${inlineImg(`${ASSET_BASE}/icons/element/el-${ (skill.element || 'none').toLowerCase() }.png`)}">
              Battle Skill ${numberCircles[i]}: ${ skill.name } [${ skill.ap }]
            </div>
            <div class="char-skill-right">
              Power: ${ skill.power } / Hits: ${ skill.maxHits }
            </div>
          </div>
        `
      }).join('')
    }
  </div>

  <div class="skill-bottom-border"></div>

  <div class="bottom-container">
    <div class="talent-container">
      ${
        char.talents.map((talent, i) => {
          return `
            <div class="talent">
              <div class="talent-name">
                Talent ${numberCircles[i]}: ${ talent.name }
              </div>

              ${
                talent.shortEffects ? `<div class="talent-ability">${ talent.shortEffects }</div>` : ''
              }

              ${
                !talent.shortEffects ? talent.effects.map(effect => {
                  return `
                    <div class="talent-ability">
                      ${ effect.desc }

                      ${
                        effect.all ? `
                          <span>
                            (${ effect.all === true ? 'All Party' : 'All ' + effect.all })
                          </span>
                        ` : ''
                      }
                    </div>
                  `
                }).join('') : ''
              }
            </div>
          `
        }).join('')
      }
    </div>
    <div class="stat-container">
      <div class="stat">
        Lv: ${ helpers.calcMaxLevelFromRating(char.star) }
      </div>

      ${
        ['hp', 'atk', 'int', 'def', 'hit', 'grd'].map(stat => {
          return `
            <div class="stat">
              ${ stat }: ${ char.stats[stat].toLocaleString() }
            </div>
          `
        }).join('')
      }

      <div class="stat">
        Max LB: ${ helpers.calcMaxLimitBreakFromRating(char.star) }
      </div>

      ${
        char.awakened ? `
          <div class="stat">
            Max Awk: 10
          </div>
        ` : ''
      }
    </div>
  </div>

</div>
`
});

const allString = allCharHTML.join('');

fs.writeFileSync(__dirname + '/compiled.html', baseHTML.split('%BASE%').join(allString), 'utf-8');
