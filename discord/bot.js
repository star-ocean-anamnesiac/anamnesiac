
const API_TOKEN = process.env.DISCORD_TOKEN;
const API_URL = 'https://anamnesiac.seiyria.com/data';
const ASSET_URL = 'https://anamnesiac.seiyria.com/assets';

const FuzzySet = require('fuzzyset.js');
const axios = require('axios');
const Discord = require('discord.js');

const itemSet = new FuzzySet();
const charSet = new FuzzySet();
const guideSet = new FuzzySet();

const client = new Discord.Client();

let currentAPICommit = '';

const weaponHash = {};
const itemHash = {};
const charHash = {};
const guideHash = {};

const refreshAPI = async () => {
  const { allItems, allCharacters, allGuides, root } = (await axios.get(API_URL)).data;

  root.weapons.forEach(({ id, name }) => {
    weaponHash[id] = name;
  });

  allItems.forEach(item => {
    itemSet.add(item.name);
    itemHash[`${item.name}.${item.cat}`] = item;
  });

  allCharacters.forEach(char => {
    charSet.add(char.name);
    charHash[`${char.name}.${char.cat}`] = char;
  });

  allGuides.forEach(guide => {
    guideSet.add(guide.name);
    guideHash[`${guide.name}.${guide.cat}`] = guide;
  });
};

const tryRefreshAPI = async () => {
  const res = await axios.head(API_URL);

  const commit = res.headers['x-commit'];
  if(commit !== currentAPICommit) {
    currentAPICommit = commit;
    await refreshAPI();
  }
};

const item = (msg, args, { region, desc }) => {
  const ref = itemSet.get(args);
  if(!ref) {
    msg.reply(`Sorry, there isn't anything like "${args}" in my item database.`);
    return;
  }

  const itemData = itemHash[`${ref[0][1]}.${region}`];
  if(!itemData) {
    msg.reply(`Sorry, there isn't anything like "${args}" in my item database in region "${region.toUpperCase()}".`);
    return;
  }

  const embed = new Discord.RichEmbed()
    .setAuthor(`${itemData.name} (${itemData.cat.toUpperCase()})`, `${ASSET_URL}/icons/menu/menu-${itemData.subtype}.png`)
    .setDescription(desc ? itemData.notes.substring(0, 2048) : '')
    .setThumbnail(`${ASSET_URL}/items/${itemData.subtype}/${itemData.picture}.png`)
    .setTitle('See it on Anamnesiac!')
    .setURL(`https://anamnesiac.seiyria.com/items?region=${itemData.cat}&item=${encodeURI(itemData.name)}`)
    .setFooter(ref[0][0] === 1 ? '' : `Sorry, I could not find an exact match for "${args}". This'll have to do, 'kay?`)
    .addField('Factors', itemData.factors.map(x => `* ${x.desc} ${x.lb ? `[Obtained @ LB ${x.lb}]` : ''}`).join('\n'))
    .addField('Obtained From', itemData.obtained);

  msg.channel.send({ embed });
};

const itemd = (msg, args, opts) => {
  opts.desc = true;
  item(msg, args, opts);
};

const char = (msg, args, { region, desc }) => {
  const ref = charSet.get(args);
  if(!ref) {
    msg.reply(`Sorry, there isn't anything like "${args}" in my character database.`);
    return;
  }

  const charData = charHash[`${ref[0][1]}.${region}`];
  if(!charData) {
    msg.reply(`Sorry, there isn't anything like "${args}" in my char database in region "${region.toUpperCase()}".`);
    return;
  }

  const embed = new Discord.RichEmbed()
    .setAuthor(`${charData.name} (${charData.cat.toUpperCase()})`, `${ASSET_URL}/icons/charclass/class-${charData.type}.png`)
    .setDescription(desc ? charData.notes.substring(0, 2048) : '')
    .setThumbnail(`${ASSET_URL}/characters/${charData.picture}.png`)
    .setTitle('See it on Anamnesiac!')
    .setURL(`https://anamnesiac.seiyria.com/characters?region=${charData.cat}&char=${encodeURI(charData.name)}`)
    .setFooter(ref[0][0] === 1 ? '' : `Sorry, I could not find an exact match for "${args}". This'll have to do, 'kay?`);

  charData.talents.forEach(tal => {
    embed.addField(`Talent: ${tal.name}`, tal.effects.map(x => `* ${x.desc}`).join('\n'));
  });

  msg.channel.send({ embed });
};

const chard = (msg, args, opts) => {
  opts.desc = true;
  char(msg, args, opts);
};

const guide = (msg, args, { region, desc }) => {
  const ref = guideSet.get(args);
  if(!ref) {
    msg.reply(`Sorry, there isn't anything like "${args}" in my guide database.`);
    return;
  }

  const guideData = guideHash[`${ref[0][1]}.${region}`];
  if(!guideData) {
    msg.reply(`Sorry, there isn't anything like "${args}" in my guide database in region "${region.toUpperCase()}".`);
    return;
  }

  const embed = new Discord.RichEmbed()
    .setAuthor(`${guideData.name} (${guideData.cat.toUpperCase()})`, `${ASSET_URL}/icons/enemytypes/type-${guideData.race.toLowerCase()}.png`)
    .setDescription(desc ? guideData.desc.substring(0, 2048) : '')
    .setThumbnail(`${ASSET_URL}/bosses/boss_${guideData.image}.png`)
    .setTitle('See it on Anamnesiac!')
    .setURL(`https://anamnesiac.seiyria.com/boss-guides?region=${guideData.cat}&guide=${encodeURI(guideData.name)}`)
    .setFooter(ref[0][0] === 1 ? '' : `Sorry, I could not find an exact match for "${args}". This'll have to do, 'kay?`)
    .addField('Active?', guideData.isActive ? 'Currently active.' : 'Currently inactive.')
    .addField('Recommendations', guideData.recommendations ? guideData.recommendations.map(x => `* ${x.plain || x.unit}`).join('\n') : 'Nothing.')
    .addField('Inflicts', guideData.statusInflictions ? guideData.statusInflictions.map(x => `* ${x}`).join('\n') : 'Nothing.')
    .addField('Weaknesses', guideData.weaknesses ? guideData.weaknesses.map(x => {
      if(x.element) return `* ${x.element} (${x.percentWeakness}%)`;
      if(x.status) return `* ${x.status} (${x.vuln})`;
      return x.plain;
    }).join('\n') : 'Nothing.');

  msg.channel.send({ embed });
};

const guided = (msg, args, opts) => {
  opts.desc = true;
  guide(msg, args, opts);
};

const commands = {
  '?item': item,
  '?itemd': itemd,
  '?boss': guide,
  '?bossd': guided,
  '?char': char,
  '?chard': chard
};

const determineRegion = (msg) => {
  const chanName = msg.channel.name;
  if(chanName.includes('jp')) return 'jp';
  return 'gl';
}

client.on('message', async msg => {

  const content = msg.content;

  const cmd = content.split(' ')[0];
  const args = content.slice(content.indexOf(' ') + 1);
  
  if(!commands[cmd]) return;

  await tryRefreshAPI();

  commands[cmd](msg, args, { region: determineRegion(msg) });
});

client.on('error', err => console.error(err));

client.login(API_TOKEN);