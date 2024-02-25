function updateState() {
  if(wildStrikeCooldown > 0) {
    wildStrikeCooldown -= 1;
  }
  if(assassinateCooldown > 0) {
    assassinateCooldown -= 1;
  }
  if(reprisalCooldown > 0) {
    reprisalCooldown -= 1;
  }
  attack_power = weapon.attack_power;
  armor_piercing = weapon.armor_piercing;
  if(queueCooldown > 0) {
    queueCooldown -= 1;
  } else {
    executeQueuedAbility(foes, attack_power);
    queuedAbility += 1;
    if(queuedAbility >= queue.length) {
      queuedAbility = 0;
    }
    resetQueueCooldown();
    updateFoeHTML();
    updateQueueHTML();
  }
  
}

function updateHTML() {
  document.getElementById('role').innerHTML = role;
  document.getElementById('attack-power').innerHTML = attack_power;
  document.getElementById('spellbreak').innerHTML = spellbreak;
  document.getElementById('armor-piercing').innerHTML = armor_piercing;
  document.getElementsByClassName('wild-strike-cd')[0].style.width = 'calc(' + wildStrikeCooldown * 100/ WILD_STRIKE_BASE_CD + '% - 2px)';
  document.getElementsByClassName('assassinate-cd')[0].style.width = 'calc(' + assassinateCooldown * 100/ ASSASSINATE_BASE_CD + '% - 2px)';
  document.getElementsByClassName('reprisal-cd')[0].style.width = 'calc(' + reprisalCooldown * 100/ REPRISAL_BASE_CD + '% - 2px)';
  updateEquippedHTML(weapon);
}

function updateQueueHTML() {
  let queue_div = document.getElementById('attack-queue');
  queue_div.replaceChildren();
  for(let i = 0; i < queue.length; i++) {
    let enabled = queuedAbility == i;
    let ability_div = createQueueAbility(queue[i], enabled, i);
    queue_div.appendChild(ability_div);
  }
}

function createQueueAbility(name, enabled, index) {
  let ability_div = document.createElement('div');
  ability_div.classList.add('ability');
  if(enabled) {
    ability_div.classList.add('enabled');
  }
  ability_div.innerHTML = name;

  let remove_button = document.createElement('button');
  remove_button.classList.add('delete');
  remove_button.innerHTML = 'X';
  remove_button.setAttribute('index', index);

  ability_div.appendChild(remove_button);
  return ability_div;
}

function updateFoeHTML() {
  let foes_div = document.getElementById('foes-list');
  foes_div.replaceChildren();
  for(let i = 0; i < foes.length; i++) {
    let foe_div = createFoe(foes[i].name, foes[i].hp, foes[i].max_hp);
    foes_div.appendChild(foe_div);
  }
}

function createFoe(name, hp, max_hp) {
  let foe_div = document.createElement('div');
  foe_div.classList.add('foe');
  foe_div.innerHTML = '👺 ' + name;
  let hp_bar = createBar(hp, max_hp);
  foe_div.appendChild(hp_bar);
  return foe_div;
}

function createBar(actual, max) {
  bar = document.createElement('div');
  bar.classList.add('bar');
  innerBar = document.createElement('div');
  innerBar.classList.add('bar-inner');
  innerBar.style.width = 'calc(' + actual * 100 / max + '% - 2px)';
  bar.appendChild(innerBar);
  return bar;
}

function updateLootHTML() {
  let loot_div = document.getElementById('loot-list');
  loot_div.replaceChildren();
  for(let i = 0; i < loot.length; i++) {
    let loot_item_div = createLootElement(loot[i]);
    loot_div.appendChild(loot_item_div);
  }
}

function createPlayerCard() {
  let player_card_div = document.getElementById('div');
  player_card_div.id = 'player-card';
  return player_card_div;
}

function createItemIcon(item) {
  item_div = document.createElement('div');
  item_div.classList.add('loot-item');
  item_div.classList.add('has-tip');
  item_div.classList.add(item.forge);
  if(item.weapon == 'dagger')
  {
    item_div.innerHTML = '🗡️';
  } else if(item.weapon == 'longsword') {
    item_div.innerHTML = '⚔️';
  } else if(item.weapon == 'battleaxe') {
    item_div.innerHTML = '🪓';
  } else if(item.weapon == 'stick') {
    item_div.innerHTML = '🧹';
  }
  let tip_title = '';
  if(item.forge) {
    tip_title += item.forge + ' ';
  }
  tip_title += item.weapon;
  let tip_description = item.attack_power + ' attack power, ';
  tip_description += item.armor_piercing + ' armor piercing, ';
  tip_description += item.spellbreak + ' spellbreak';
  item_div.appendChild(createTip(tip_title, tip_description));
  return item_div;
}

function createLootElement(item) {
  let item_div = document.createElement('div');
  let item_icon = createItemIcon(item);
  let equip_button = document.createElement('button');
  equip_button.innerHTML = 'Equip';
  equip_button.classList.add('equip');
  equip_button.setAttribute('guid', item.guid);
  item_div.appendChild(item_icon);
  item_div.appendChild(equip_button);
  return item_div;
}

function removeFromLoot(item_guid) {
  for(let i = 0; i < loot.length; i++) {
    if(loot[i].guid == item_guid) {
      loot.splice(i, 1);
      break;
    }
  }
}

function executeAbility(name, foes, attack_power) {
  if(name == "wild strike") {
    attack_random(foes, attack_power);
  } else if(name == 'assassinate') {
    assassinate(foes, attack_power);
  }
}

function executeQueuedAbility(foes, attack_power) {
  executeAbility(queue[queuedAbility], foes, attack_power);
}

function equip(item_guid) {
  let item_to_equip = null;
  for(let i = 0; i < loot.length; i++) {
    if(loot[i].guid == item_guid) {
      item_to_equip = loot[i];
      break;
    }
  }
  loot.push(weapon);
  weapon = item_to_equip;
  removeFromLoot(item_to_equip.guid);
  updateLootHTML();
}

function createEquippedItemElement(item) {
  let item_div = document.createElement('div');
  let item_icon = createItemIcon(item);
  item_div.appendChild(item_icon);
  return item_div;
}

function createTip(header, description) {
  tip_div = document.createElement('div');
  tip_div.classList.add('tooltip');
  tip_header_div = document.createElement('div');
  tip_header_div.classList.add('tooltip-header');
  tip_header_div.innerHTML = header;
  tip_description_div = document.createElement('div');
  tip_description_div.classList.add('tooltip-description');
  tip_description_div.innerHTML = description;

  tip_div.appendChild(tip_header_div);
  tip_div.appendChild(tip_description_div);

  return tip_div;
}

function updateEquippedHTML(weapon) {
  let weapon_div = document.getElementById('weapon');
  weapon_div.replaceChildren(createEquippedItemElement(weapon));
  weapon_div.classList.add(weapon.weapon);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function calculateDamage(attack_power, foe_armor) {
  final_power = attack_power + getRandomInt(attack_power) / 2;
  final_power *= 1 - (foe_armor / 100);
  return Math.floor(final_power);
}

function randomForge() {
  let r = Math.random();
  if(r < 0.9) {
    return null;
  } else if(r < 0.99) {
    return 'gilded';
  } else if(r < 0.999) {
    return 'diamond';
  } else {
    return 'cosmic';
  }
}

function lootSomethingMaybe() {
  if(Math.random() < 1) {
    loot.push({
      weapon: 'dagger',
      attack_power: 9,
      armor_piercing: 1,
      forge: randomForge(),
      guid: crypto.randomUUID()
    });
    updateLootHTML();
  }
}

function removeFoe(index) {
  foes.splice(index, 1);
  lootSomethingMaybe();
}

function attack_random(foes, attack_power) {
  wildStrikeCooldown = WILD_STRIKE_BASE_CD;
  let foe_i = getRandomInt(foes.length);
  let foe = foes[foe_i];
  let damage = calculateDamage(attack_power, foe.armor);
  foe.hp -= damage;
  recent_foe = foe;
  if(foe.hp <= 0) {
    removeFoe(foe_i);
  }
}

function assassinate(foes, attack_power) {
  assassinateCooldown = ASSASSINATE_BASE_CD;
  let foe_i = 0;
  for(let i = 1; i < foes.length; i++) {
    if(foes[i].hp < foes[foe_i].hp) {
      foe_i = i;
    }
  }
  let foe = foes[foe_i];
  let damage = calculateDamage(attack_power, foe.armor);
  foe.hp -= damage;
  recent_foe = foe;
  if(foe.hp <= 0) {
    removeFoe(foe_i);
    assassinateCooldown = 0;
  }
}

function reprisal(foe, attack_power) {
  reprisalCooldown = REPRISAL_BASE_CD;
  let damage = calculateDamage(attack_power, foe.armor);
  foe.hp -= damage;
  recent_foe = foe;
  if(foe.hp <= 0) {
    foe.hp = 1;
  }
}

function resetQueueCooldown() {
  queueCooldown = 500;
}

setInterval(() => {
  updateHTML();
  updateState();
}, 1);

const WILD_STRIKE_BASE_CD = 250;
const ASSASSINATE_BASE_CD = 1000;
const REPRISAL_BASE_CD = 500;

let layer = 1;
let armor_piercing = 0;
let attack_power = 1;
let spellbreak = 0;
let role = 'Shadowblade';

let wildStrikeCooldown = 0;
let assassinateCooldown = 0;
let reprisalCooldown = 0;

let foes = [];
let layer_1_foes = [];
let layer_2_foes = [];
let layer_3_foes = [];

let queue = [];
queue.push('wild strike');
queue.push('wild strike');
queue.push('assassinate');

let queuedAbility = 0;

let queueCooldown = 1_000_000;
resetQueueCooldown();

let weapon = {
  weapon: 'stick',
  attack_power: 3,
  armor_piercing: 0,
  spellbreak: 0,
  forge: null,
  guid: '042563f7-24bb-4998-851d-019499b0f06b'
}

let loot = [];

function setUpLayer1Foes() {
  layer_1_foes.push({
    name: 'Blazing Drake',
    hp: 100,
    max_hp: 100,
    armor: 0
  })
}

function setUpLayer2Foes() {
  layer_2_foes.push({
    name: 'Ironscale',
    hp: 500,
    max_hp: 500,
    armor: 5
  });
}

function setUpLayer3Foes() {
  layer_3_foes.push({
    name: 'Zephyr, Wyrm of the Void',
    hp: 1000,
    max_hp: 1000,
    armor: 10
  });
}

setUpLayer1Foes();
setUpLayer2Foes();
setUpLayer3Foes();
foes = layer_1_foes;

updateLootHTML();
updateFoeHTML();
updateQueueHTML();

ability_div = document.getElementById('abilities');
ability_div.addEventListener('click', ()=> {
  updateFoeHTML();
});

attack_button = document.getElementById('attack');
attack_button.addEventListener('click', ()=> {
  if(wildStrikeCooldown <= 0) {
    attack_random(foes, attack_power);
  }
});

assassinate_button = document.getElementById('assassinate');
assassinate_button.addEventListener('click', ()=> {
  if(assassinateCooldown <= 0) {
    assassinate(foes, attack_power);
  }
});

reprisal_button = document.getElementById('reprisal');
reprisal_button.addEventListener('click', ()=> {
  if(reprisalCooldown <= 0) {
    reprisal(recent_foe, attack_power);
  }
});

go_layer_1_button = document.getElementById('go_layer_1');
go_layer_1_button.addEventListener('click', ()=> {
  layer = 1;
  foes = layer_1_foes;
  updateFoeHTML();
});

go_layer_2_button = document.getElementById('go_layer_2');
go_layer_2_button.addEventListener('click', ()=> {
  layer = 2;
  foes = layer_2_foes;
  updateFoeHTML();
});

go_layer_3_button = document.getElementById('go_layer_3');
go_layer_3_button.addEventListener('click', ()=> {
  layer = 3;
  foes = layer_3_foes;
  updateFoeHTML();
});

loot_div = document.getElementById('loot');
loot_div.addEventListener('click', function(e) {
  if(e.target.classList.contains('equip')) {
    equip(e.target.getAttribute('guid'));
  }
});

queue_div = document.getElementById('attack-queue');
queue_div.addEventListener('click', function(e) {
  if(e.target.classList.contains('delete')) {
    queue.splice(e.target.getAttribute('index'), 1);
    updateQueueHTML();
  }
});